/**
 * CAPABILITY TYPES
 * 
 * Type definitions for the capability system
 */

export interface Capability {
  id: string;
  name: string;
  type: string;
  category: string;
  summary_one_line: string;
  metadata: Record<string, any>;
}

export interface CapabilityExecutionResult {
  success: boolean;
  output: any;
  execution_time: number;
  metadata?: Record<string, any>;
}

export default Capability;
