#!/usr/bin/env python3
"""
NEXUS Live Performance Dashboard
Real-time monitoring of NEXUS-4.5 system metrics
"""

import requests
import time
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.live import Live
from rich.panel import Panel
from rich.layout import Layout
from rich.text import Text
from typing import Dict, Optional

console = Console()

NEXUS_URL = "http://localhost:8080"

def get_nexus_status() -> Optional[Dict]:
    """Fetch NEXUS status from API"""
    try:
        response = requests.get(f"{NEXUS_URL}/status", timeout=2)
        return response.json()
    except requests.exceptions.RequestException:
        return None

def create_status_table(status: Dict) -> Table:
    """Create main status table"""
    table = Table(title="🎯 NEXUS System Status", show_header=True, header_style="bold cyan")
    table.add_column("Metric", style="cyan", width=30)
    table.add_column("Value", style="green", width=40)
    table.add_column("Status", style="yellow", width=15)
    
    # System Status
    initialized = status.get("initialized", False)
    status_emoji = "✅" if initialized else "❌"
    table.add_row(
        "System Status",
        "Running" if initialized else "Down",
        status_emoji
    )
    
    # Uptime
    table.add_row(
        "Uptime",
        status.get("uptime", "Unknown"),
        "🕐"
    )
    
    # Version
    table.add_row(
        "Version",
        status.get("version", "Unknown"),
        "📦"
    )
    
    # Personalities
    ps = status.get("personalitySystem", {})
    total_personalities = ps.get("totalPersonalities", 0)
    personality_status = "✅" if total_personalities == 45 else "⚠️"
    table.add_row(
        "Personalities Loaded",
        f"{total_personalities}/45",
        personality_status
    )
    
    # Circuit Breaker
    circuit_state = status.get("loaderHealth", {}).get("circuitBreakerState", "UNKNOWN")
    circuit_emoji = "✅" if circuit_state == "CLOSED" else "❌"
    table.add_row(
        "Circuit Breaker",
        circuit_state,
        circuit_emoji
    )
    
    # Memory Usage
    memory_mb = status.get("loaderHealth", {}).get("memoryUsageMB", 0)
    memory_status = "✅" if memory_mb < 50 else "⚠️" if memory_mb < 100 else "❌"
    table.add_row(
        "Memory Usage",
        f"{memory_mb:.2f} MB",
        memory_status
    )
    
    # Cache Hit Rate
    cache_hit_rate = ps.get("cacheHitRate", 0)
    cache_status = "✅" if cache_hit_rate > 70 else "⚠️" if cache_hit_rate > 40 else "❌"
    table.add_row(
        "Cache Hit Rate",
        f"{cache_hit_rate:.1f}%",
        cache_status
    )
    
    return table

def create_traits_table(status: Dict) -> Table:
    """Create traits composition table"""
    table = Table(title="🧬 Trait Composition", show_header=True, header_style="bold magenta")
    table.add_column("Component", style="magenta", width=25)
    table.add_column("Count", style="green", justify="right", width=15)
    
    traits = status.get("traitComposition", {})
    
    table.add_row("Total Traits", str(traits.get("totalTraits", 0)))
    table.add_row("Total Triggers", str(traits.get("totalTriggers", 0)))
    table.add_row("Knowledge Domains", str(traits.get("totalDomains", 0)))
    table.add_row("Patterns Loaded", str(status.get("patternsLoaded", 0)))
    table.add_row("Enhancements Performed", str(status.get("enhancementsPerformed", 0)))
    
    return table

def create_consciousness_panel(status: Dict) -> Panel:
    """Create consciousness patterns panel"""
    patterns = status.get("consciousness", [])
    if patterns:
        pattern_text = "\n".join([f"✓ {p}" for p in patterns])
    else:
        pattern_text = "No patterns loaded"
    
    return Panel(
        Text(pattern_text, style="cyan"),
        title="🧠 Consciousness Patterns",
        border_style="cyan"
    )

def create_health_panel(status: Dict) -> Panel:
    """Create system health panel"""
    consciousness_health = status.get("consciousnessHealth", {})
    score = consciousness_health.get("score", 0)
    health_status = consciousness_health.get("status", "unknown")
    
    # Color based on score
    if score >= 75:
        color = "green"
        emoji = "✅"
    elif score >= 50:
        color = "yellow"
        emoji = "⚠️"
    else:
        color = "red"
        emoji = "❌"
    
    health_text = f"""
{emoji} Health Score: {score}/100
Status: {health_status.upper()}

Factors:
✓ Patterns Loaded: {consciousness_health.get('factors', {}).get('patternsLoaded', False)}
✓ Bridge Initialized: {consciousness_health.get('factors', {}).get('bridgeInitialized', False)}
✓ History Active: {consciousness_health.get('factors', {}).get('historyActive', False)}
✓ Breakthrough Capture: {consciousness_health.get('factors', {}).get('breakthroughCapture', False)}
"""
    
    return Panel(
        Text(health_text.strip(), style=color),
        title="💊 System Health",
        border_style=color
    )

def create_dashboard(status: Optional[Dict]) -> Layout:
    """Create complete dashboard layout"""
    layout = Layout()
    
    if not status:
        error_panel = Panel(
            Text("❌ NEXUS is not running or not responding\\n\\nStart NEXUS with: npx tsx nexus-runtime.v2.ts", 
                 style="red bold"),
            title="⚠️  Connection Error",
            border_style="red"
        )
        layout.split_column(error_panel)
        return layout
    
    # Create header
    header = Panel(
        Text(f"NEXUS-4.5 Live Dashboard - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 
             style="bold white", justify="center"),
        style="bold blue"
    )
    
    # Split layout
    layout.split_column(
        Layout(name="header", size=3),
        Layout(name="body")
    )
    
    layout["header"].update(header)
    
    # Split body into columns
    layout["body"].split_row(
        Layout(name="left", ratio=2),
        Layout(name="right", ratio=1)
    )
    
    # Split left column
    layout["left"].split_column(
        Layout(name="status"),
        Layout(name="traits")
    )
    
    # Split right column
    layout["right"].split_column(
        Layout(name="health"),
        Layout(name="consciousness")
    )
    
    # Add components
    layout["status"].update(create_status_table(status))
    layout["traits"].update(create_traits_table(status))
    layout["health"].update(create_health_panel(status))
    layout["consciousness"].update(create_consciousness_panel(status))
    
    return layout

def main():
    """Main dashboard loop"""
    console.print("\n[bold cyan]🚀 Starting NEXUS Live Dashboard...[/bold cyan]\n")
    console.print("[dim]Press Ctrl+C to exit[/dim]\n")
    
    try:
        with Live(create_dashboard(get_nexus_status()), refresh_per_second=1, console=console) as live:
            while True:
                time.sleep(1)
                status = get_nexus_status()
                live.update(create_dashboard(status))
    except KeyboardInterrupt:
        console.print("\n\n[bold cyan]✅ Dashboard stopped[/bold cyan]\n")

if __name__ == "__main__":
    main()
