#!/bin/bash

echo "🧹 NEXUS Repository Cleanup"
echo "================================"
echo ""
echo "Goal: Support BOTH CSS Engine + Personality AI"
echo ""

# Create archive structure
echo "📁 Creating archive structure..."
mkdir -p archive/old-versions
mkdir -p archive/analysis-docs

# Archive old NEXUS versions (keep history, declutter workspace)
echo "📦 Archiving old versions..."
[ -d "nexus" ] && mv nexus archive/old-versions/ && echo "  ✅ Archived: nexus/"
[ -d "Nexus-4" ] && mv Nexus-4 archive/old-versions/ && echo "  ✅ Archived: Nexus-4/"
[ -d "nexusv3" ] && mv nexusv3 archive/old-versions/ && echo "  ✅ Archived: nexusv3/"
[ -d "nexusv3-deploy" ] && mv nexusv3-deploy archive/old-versions/ && echo "  ✅ Archived: nexusv3-deploy/"
[ -d "nexus2" ] && mv nexus2 archive/old-versions/ && echo "  ✅ Archived: nexus2/"

# Archive analysis documents (keep for reference, reduce clutter)
echo "📚 Archiving analysis documents..."
mv *_ANALYSIS.md archive/analysis-docs/ 2>/dev/null && echo "  ✅ Moved analysis docs"
mv *_SUMMARY.md archive/analysis-docs/ 2>/dev/null && echo "  ✅ Moved summary docs"
mv *_REPORT.md archive/analysis-docs/ 2>/dev/null && echo "  ✅ Moved report docs"
mv *_GUIDE.md archive/analysis-docs/ 2>/dev/null && echo "  ✅ Moved guide docs"
mv COMPILATION_DECISION_SUMMARY.md archive/analysis-docs/ 2>/dev/null
mv INSTALL-NEXUS-README.md archive/analysis-docs/ 2>/dev/null
mv TS_VS_MJS_COMPARISON.md archive/analysis-docs/ 2>/dev/null
mv TYPESCRIPT_*.md archive/analysis-docs/ 2>/dev/null

# Keep important root files
echo "📌 Keeping important root files:"
echo "  - README.md (main entry)"
echo "  - install-nexus.sh (setup script)"
echo "  - Nexus-4.5/ (active system)"

# Organize Nexus-4.5 test fixtures
echo "🧪 Organizing test fixtures..."
mkdir -p Nexus-4.5/tests/fixtures
mv Nexus-4.5/test-*.json Nexus-4.5/tests/fixtures/ 2>/dev/null && echo "  ✅ Moved test-*.json"
mv Nexus-4.5/*-request.json Nexus-4.5/tests/fixtures/ 2>/dev/null && echo "  ✅ Moved request files"
mv Nexus-4.5/*-result.json Nexus-4.5/tests/fixtures/ 2>/dev/null && echo "  ✅ Moved result files"
mv Nexus-4.5/all-experiments.json Nexus-4.5/tests/fixtures/ 2>/dev/null
mv Nexus-4.5/debate-demo.json Nexus-4.5/tests/fixtures/ 2>/dev/null

# Organize utility scripts
echo "🔧 Organizing utility scripts..."
mkdir -p Nexus-4.5/scripts
# Keep start-nexus.sh at root of Nexus-4.5 for convenience
mv Nexus-4.5/check-files.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/cleanup-*.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/deploy-*.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/health-check.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/install-extensions.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/proof-test.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/quick-test.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/request-improvements.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/rotate-personalities.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/test-*.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/troubleshoot.sh Nexus-4.5/scripts/ 2>/dev/null
mv Nexus-4.5/verify.sh Nexus-4.5/scripts/ 2>/dev/null

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 New structure:"
echo "  /archive/old-versions/    - Old NEXUS versions"
echo "  /archive/analysis-docs/   - Historical analysis"
echo "  /Nexus-4.5/               - Active system (CSS + AI)"
echo "  /Nexus-4.5/tests/         - Tests & fixtures"
echo "  /Nexus-4.5/scripts/       - Utility scripts"
echo ""
echo "🚀 NEXUS still running on port 8080"
