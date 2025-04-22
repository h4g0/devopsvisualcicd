// Code generator for Ecore blocks
// Add this at the top of the file, before the EcoreGenerator class
let generatorInitialized = false

export class EcoreGenerator {
  // Initialize the generator
  static init() {
    // Prevent multiple initializations
    if (generatorInitialized) {
      return
    }

    // Create a namespace for our generator functions
    if (!window.Blockly.Ecore) {
      window.Blockly.Ecore = {}
    }

    // Define generator functions for each block type
    this.defineGenerators()

    // Mark as initialized
    generatorInitialized = true
    console.log("Ecore generator initialized successfully")
  }

  // Define generator functions for all block types
  static defineGenerators() {
    const Ecore = window.Blockly.Ecore

    // Pipeline block generator
    Ecore["ecore_pipeline"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "default_pipeline"
      const concurrent = block.getFieldValue("ATTR_CONCURRENT") === "TRUE"

      // Get connected blocks
      const whenBlock = block.getInputTargetBlock("CONT_WHEN")
      const jobBlock = block.getInputTargetBlock("CONT_JOB")
      const toolBlock = block.getInputTargetBlock("CONT_TOOL")
      const envBlock = block.getInputTargetBlock("CONT_ENVIRONMENT")
      const permBlock = block.getInputTargetBlock("CONT_PERMISSION")

      // Generate code with proper indentation
      let code = `# Pipeline: ${name}\n`
      code += `name: ${name}\n`
      code += `concurrent: ${concurrent}\n\n`

      // Add when blocks if present
      if (whenBlock) {
        const whenCode = window.Blockly.Ecore.blockToCode(whenBlock)
        code += whenCode
      }

      // Add job blocks if present
      if (jobBlock) {
        code += "jobs:\n"
        const jobCode = window.Blockly.Ecore.blockToCode(jobBlock)
        code += jobCode
      }

      // Add tool blocks if present
      if (toolBlock) {
        code += "tools:\n"
        const toolCode = window.Blockly.Ecore.blockToCode(toolBlock)
        code += toolCode
      }

      // Add environment blocks if present
      if (envBlock) {
        code += "env:\n"
        const envCode = window.Blockly.Ecore.blockToCode(envBlock)
        code += envCode
      }

      // Add permission blocks if present
      if (permBlock) {
        code += "permissions:\n"
        const permCode = window.Blockly.Ecore.blockToCode(permBlock)
        code += permCode
      }

      return code
    }

    // Job block generator
    Ecore["ecore_job"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_job"
      const allowFailure = block.getFieldValue("ATTR_ALLOWFAILURE") === "TRUE"
      const description = block.getFieldValue("ATTR_DESCRIPTION") || ""

      // Get connected blocks
      const toolBlock = block.getInputTargetBlock("CONT_TOOL")
      const commandBlock = block.getInputTargetBlock("CONT_COMMAND")
      const ifThenElseBlock = block.getInputTargetBlock("CONT_IFTHENELSE")
      const inputBlock = block.getInputTargetBlock("CONT_INPUT")
      const envBlock = block.getInputTargetBlock("CONT_ENVIRONMENT")
      const permBlock = block.getInputTargetBlock("CONT_PERMISSION")
      const outputBlock = block.getInputTargetBlock("REL_OUTPUT")
      const dependsBlock = block.getInputTargetBlock("REL_DEPENDS")

      // Generate code with proper indentation
      let code = `  ${name}:\n`

      if (description) {
        code += `    description: "${description}"\n`
      }

      // Only add continue-on-error if it's true
      if (allowFailure) {
        code += `    continue-on-error: ${allowFailure}\n`
      }

      // Add tool blocks if present
      if (toolBlock) {
        code += "    tools:\n"
        const toolCode = window.Blockly.Ecore.blockToCode(toolBlock)
        // Increase indentation for nested blocks
        code += indentCode(toolCode, 3)
      }

      // Add command blocks if present
      if (commandBlock) {
        code += "    steps:\n"
        const commandCode = window.Blockly.Ecore.blockToCode(commandBlock)
        // Increase indentation for nested blocks
        code += indentCode(commandCode, 3)
      }

      // Add ifThenElse blocks if present
      if (ifThenElseBlock) {
        code += "    if:\n"
        const ifThenElseCode = window.Blockly.Ecore.blockToCode(ifThenElseBlock)
        // Increase indentation for nested blocks
        code += indentCode(ifThenElseCode, 3)
      }

      // Add input blocks if present
      if (inputBlock) {
        code += "    inputs:\n"
        const inputCode = window.Blockly.Ecore.blockToCode(inputBlock)
        // Increase indentation for nested blocks
        code += indentCode(inputCode, 3)
      }

      // Add environment blocks if present
      if (envBlock) {
        code += "    env:\n"
        const envCode = window.Blockly.Ecore.blockToCode(envBlock)
        // Increase indentation for nested blocks
        code += indentCode(envCode, 3)
      }

      // Add permission blocks if present
      if (permBlock) {
        code += "    permissions:\n"
        const permCode = window.Blockly.Ecore.blockToCode(permBlock)
        // Increase indentation for nested blocks
        code += indentCode(permCode, 3)
      }

      // Add output blocks if present
      if (outputBlock) {
        const outputCode = window.Blockly.Ecore.blockToCode(outputBlock)
        code += `    outputs:\n      - ${outputCode.trim()}\n`
      }

      // Add depends blocks if present
      if (dependsBlock) {
        const dependsCode = window.Blockly.Ecore.blockToCode(dependsBlock)
        code += `    needs: [${dependsCode}]\n`
      }

      // Check for next job block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }

      return code
    }

    // Job value block generator
    Ecore["ecore_job_value"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_job"
      return `"${name}"`
    }

    // Command block generator
 // Command block generator
// Command block generator
// Command block generator
// Command block generator
Ecore["ecore_command"] = (block: any) => {
  const name = block.getFieldValue("ATTR_NAME") || "unnamed_command"

  // Get connected blocks
  const toolBlock = block.getInputTargetBlock("CONT_TOOL")
  const paramBlock = block.getInputTargetBlock("CONT_PARAMETER")
  const dependsBlock = block.getInputTargetBlock("REL_DEPENDS")

  // Generate code with proper indentation
  let code = `      - name: ${name}\n`

  // Add tool blocks if present
  if (toolBlock) {
    const toolCode = window.Blockly.Ecore.blockToCode(toolBlock)
    const toolValue = toolCode.trim().replace(/"/g, '') // Remove quotes
    
    // Check if this is a shell command (denoted by "|")
    if (toolValue === "|") {
      // This is a shell command using |
      code += `        run: |\n`
      
      // Add default shell command if no parameters are provided
      if (!paramBlock) {
        code += `          echo "Running shell commands"\n`
        code += `          echo "Current directory: $(pwd)"\n`
      } else {
        // For shell commands with parameters, we need to ensure each parameter is on a new line with correct indentation
        const paramCode = window.Blockly.Ecore.processShellParameters(paramBlock);
        code += paramCode;
      }
    }
    // Check if the tool contains "actions/" in its value
    else if (toolValue.includes("actions/")) {
      // This is a GitHub Actions tool - use the exact toolValue without modification
      code += `        uses: ${toolValue}\n`
      
      // Add appropriate default parameters based on the tool
      if (toolValue.includes("setup-python") && !paramBlock) {
        code += `        with:\n`
        code += `          python-version: '3.x'  # Uses the latest stable 3.x version\n`
      } else if (toolValue.includes("setup-node") && !paramBlock) {
        code += `        with:\n`
        code += `          node-version: '18.x'\n`
      } else if (toolValue.includes("setup-java") && !paramBlock) {
        code += `        with:\n`
        code += `          distribution: 'temurin'\n`
        code += `          java-version: '17'\n`
      } else if (paramBlock) {
        code += `        with:\n`
        const paramCode = window.Blockly.Ecore.blockToCode(paramBlock)
        // Increase indentation for nested blocks
        code += indentCode(paramCode, 4)
      }
    } else {
      // Regular tool - like yarn, npm, etc.
      let command = toolValue;
      
      // Add parameters in a single line with single space between them
      if (paramBlock) {
        // Get parameters and add them to the command
        const paramCode = window.Blockly.Ecore.processRegularParameters(paramBlock);
        command += ' ' + paramCode;
      }
      
      // Add the run command
      code += `        run: ${command}\n`
    }
  }

  // Add depends blocks if present
  if (dependsBlock) {
    const dependsCode = window.Blockly.Ecore.blockToCode(dependsBlock)
    code += `        needs: [${dependsCode}]\n`
  }

  // Check for next command block
  const nextBlock = block.getNextBlock()
  if (nextBlock) {
    const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
    code += nextCode
  }

  return code
}

// Parameter block generator
Ecore["ecore_parameter"] = (block: any) => {
  const parameter = block.getFieldValue("ATTR_PARAMETER") || "param"
  
  // Get the parent block
  const parentBlock = block.getParent();
  
  // Check if parent is a command block and its tool is "|"
  let isShellCommand = false;
  let isRegularCommand = false;
  
  if (parentBlock && parentBlock.type === "ecore_command") {
    const toolBlock = parentBlock.getInputTargetBlock("CONT_TOOL");
    if (toolBlock && toolBlock.type === "ecore_tool_value") {
      const toolName = toolBlock.getFieldValue("ATTR_NAME");
      isShellCommand = (toolName === "|");
      isRegularCommand = (toolName !== "|" && !toolName.includes("actions/"));
    }
  }
  
  // Generate code with proper indentation based on parent
  let code;
  if (isShellCommand) {
    // For shell commands, we'll handle the indentation in a special way
    // Just return the parameter text to be processed later
    code = `${parameter}\n`;
  } else if (isRegularCommand) {
    // For regular commands like yarn, just return the parameter
    code = `${parameter}`;
  } else {
    // Regular parameter format for "with:" sections
    code = `          ${parameter}\n`;
  }

  // Check for next parameter block
  const nextBlock = block.getNextBlock()
  if (nextBlock) {
    const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
    code += nextCode
  }

  return code
}

// Add a special function to handle shell command parameters
Ecore.processShellParameters = (paramBlock: any) => {
  if (!paramBlock) {
    return "";
  }
  
  // Get all parameters as a single string
  const paramCode = window.Blockly.Ecore.blockToCode(paramBlock);
  
  // Split into lines and indent each line properly
  const paramLines = paramCode.split('\n');
  let indentedParams = "";
  
  for (const line of paramLines) {
    if (line.trim()) {
      // Add exactly 10 spaces (8 spaces + 2 for proper level) for each shell command
      indentedParams += `          ${line.trim()}\n`;
    }
  }
  
  return indentedParams;
}

// Add a special function to handle regular command parameters
Ecore.processRegularParameters = (paramBlock: any) => {
  if (!paramBlock) {
    return "";
  }
  
  // Get all parameters as a single string
  const paramCode = window.Blockly.Ecore.blockToCode(paramBlock);
  
  // Split into lines and join with a single space
  const params = paramCode.trim().split('\n')
    .filter(line => line.trim())
    .map(line => line.trim())
    .join(' ');
  
  return params;
}

// Tool value block generator
Ecore["ecore_tool_value"] = (block: any) => {
  const name = block.getFieldValue("ATTR_NAME") || "unnamed_tool"
  
  // Check if this is a shell command indicator
  if (name === "|") {
    return `"|"`
  }
  
  // For all other tools, just return the exact name without modifications
  return `"${name}"`
}
// Parameter block generator
Ecore["ecore_parameter"] = (block: any) => {
  const parameter = block.getFieldValue("ATTR_PARAMETER") || "param"
  
  // Get the parent block
  const parentBlock = block.getParent();
  
  // Check if parent is a command block and its tool is "|"
  let isShellCommand = false;
  let isRegularCommand = false;
  
  if (parentBlock && parentBlock.type === "ecore_command") {
    const toolBlock = parentBlock.getInputTargetBlock("CONT_TOOL");
    if (toolBlock && toolBlock.type === "ecore_tool_value") {
      const toolName = toolBlock.getFieldValue("ATTR_NAME");
      isShellCommand = (toolName === "|");
      isRegularCommand = (toolName !== "|" && !toolName.includes("actions/"));
    }
  }
  
  // Generate code with proper indentation based on parent
  let code;
  if (isShellCommand) {
    // For shell commands, we'll handle the indentation in a special way
    // Just return the parameter text to be processed later
    code = `${parameter}\n`;
  } else if (isRegularCommand) {
    // For regular commands like yarn, just return the parameter
    code = `${parameter}`;
  } else {
    // Regular parameter format for "with:" sections
    code = `          ${parameter}\n`;
  }

  // Check for next parameter block
  const nextBlock = block.getNextBlock()
  if (nextBlock) {
    const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
    code += nextCode
  }

  return code
}

// Add a special function to handle shell command parameters
Ecore.processShellParameters = (paramBlock: any) => {
  if (!paramBlock) {
    return "";
  }
  
  // Get all parameters as a single string
  const paramCode = window.Blockly.Ecore.blockToCode(paramBlock);
  
  // Split into lines and indent each line properly
  const paramLines = paramCode.split('\n');
  let indentedParams = "";
  
  for (const line of paramLines) {
    if (line.trim()) {
      // Add exactly 10 spaces (8 spaces + 2 for proper level) for each shell command
      indentedParams += `          ${line.trim()}\n`;
    }
  }
  
  return indentedParams;
}
// Parameter block generator
Ecore["ecore_parameter"] = (block: any) => {
  const parameter = block.getFieldValue("ATTR_PARAMETER") || "param"
  
  // Get the parent block
  const parentBlock = block.getParent();
  
  // Check if parent is a command block and its tool is "|"
  let isShellCommand = false;
  let isRegularCommand = false;
  
  if (parentBlock && parentBlock.type === "ecore_command") {
    const toolBlock = parentBlock.getInputTargetBlock("CONT_TOOL");
    if (toolBlock && toolBlock.type === "ecore_tool_value") {
      const toolName = toolBlock.getFieldValue("ATTR_NAME");
      isShellCommand = (toolName === "|");
      isRegularCommand = (toolName !== "|" && !toolName.includes("actions/"));
    }
  }
  
  // Generate code with proper indentation based on parent
  let code;
  if (isShellCommand) {
    // For shell commands, each parameter is a new line with proper indentation (8 spaces)
    code = `          ${parameter}\n`;
  } else if (isRegularCommand) {
    // For regular commands like yarn, just return the parameter
    code = `${parameter}`;
  } else {
    // Regular parameter format for "with:" sections
    code = `          ${parameter}\n`;
  }

  // Check for next parameter block
  const nextBlock = block.getNextBlock()
  if (nextBlock) {
    const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
    code += nextCode
  }

  return code
}

// Parameter block generator
Ecore["ecore_parameter"] = (block: any) => {
  const parameter = block.getFieldValue("ATTR_PARAMETER") || "param"
  
  // Get the parent block
  const parentBlock = block.getParent();
  
  // Check if parent is a command block and its tool is "|"
  let isShellCommand = false;
  let isRegularCommand = false;
  
  if (parentBlock && parentBlock.type === "ecore_command") {
    const toolBlock = parentBlock.getInputTargetBlock("CONT_TOOL");
    if (toolBlock && toolBlock.type === "ecore_tool_value") {
      const toolName = toolBlock.getFieldValue("ATTR_NAME");
      isShellCommand = (toolName === "|");
      isRegularCommand = (toolName !== "|" && !toolName.includes("actions/"));
    }
  }
  
  // Generate code with proper indentation based on parent
  let code;
  if (isShellCommand) {
    // For shell commands, each parameter is a new line with proper indentation
    code = `          ${parameter}\n`;
  } else if (isRegularCommand) {
    // For regular commands like yarn, just return the parameter
    code = `${parameter}`;
  } else {
    // Regular parameter format for "with:" sections
    code = `          ${parameter}\n`;
  }

  // Check for next parameter block
  const nextBlock = block.getNextBlock()
  if (nextBlock) {
    const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
    code += nextCode
  }

  return code
}
    
    // Parameter block generator
    Ecore["ecore_parameter"] = (block: any) => {
      const parameter = block.getFieldValue("ATTR_PARAMETER") || "param"
      
      // Get the parent block
      const parentBlock = block.getParent();
      
      // Check if parent is a command block and its tool is "|"
      let isShellCommand = false;
      let isRegularCommand = false;
      
      if (parentBlock && parentBlock.type === "ecore_command") {
        const toolBlock = parentBlock.getInputTargetBlock("CONT_TOOL");
        if (toolBlock && toolBlock.type === "ecore_tool_value") {
          const toolName = toolBlock.getFieldValue("ATTR_NAME");
          isShellCommand = (toolName === "|");
          isRegularCommand = (toolName !== "|" && !toolName.includes("actions/"));
        }
      }
      
      // Generate code with proper indentation based on parent
      let code;
      if (isShellCommand) {
        // For shell commands, each parameter is a new line of the script
        code = `          ${parameter}\n`;
      } else if (isRegularCommand) {
        // For regular commands like yarn, just return the parameter
        code = `${parameter}`;
      } else {
        // Regular parameter format for "with:" sections
        code = `          ${parameter}\n`;
      }
    
      // Check for next parameter block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }
    
      return code
    }

    // Command value block generator
    Ecore["ecore_command_value"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_command"
      return `"${name}"`
    }

    // Environment block generator
    Ecore["ecore_environment"] = (block: any) => {
      const key = block.getFieldValue("ATTR_KEY") || "ENV_KEY"
      const value = block.getFieldValue("ATTR_VALUE") || "value"

      // Generate code with proper indentation
      let code = `  ${key}: "${value}"\n`

      // Check for next environment block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }

      return code
    }

    // When block generator
    Ecore["ecore_when"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_trigger"
      const trigger = block.getFieldValue("ATTR_TRIGGER") || ""
      const timer = block.getFieldValue("ATTR_TIMER") || ""
      
      // Generate code with proper indentation
      let code = "on:\n"
      
      // Handle workflow_dispatch trigger
      if (trigger === "workflow_dispatch") {
        code += `  workflow_dispatch:\n`
      }
      // Handle other triggers with branches
      else if (trigger) {
        code += `  ${trigger}:\n`
        code += `    branches: [main]\n`
      }
      
      // Handle scheduled triggers
      if (timer) {
        code += `  schedule:\n`
        code += `    - cron: "${timer}"\n`
      }
      
      code += "\n"
      
      // Check for next when block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }
      
      return code
    }
    // Artifact block generator
    Ecore["ecore_artifact"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_artifact"

      // For statement blocks, return full code
      let code = `      - name: ${name}\n`

      // Check for next artifact block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }

      return code
    }

    // Artifact value block generator
    Ecore["ecore_artifact_value"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_artifact"
      return `"${name}"`
    }

    // Tool block generator
    Ecore["ecore_tool"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_tool"

      // For statement blocks, return full code
      let code = `      - ${name}\n`

      // Check for next tool block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }

      return code
    }

    // Tool value block generator
    Ecore["ecore_tool_value"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_tool"
      
      // Check if this is a shell command indicator
      if (name === "|") {
        return `"|"`
      }
      
      // Check if this is a GitHub Action
      if (name.startsWith("actions/")) {
        // Return with version for GitHub actions
        const actionName = name.split("@")[0]; // Get just the action name part
        
        // Default to v4 version if no version specified
        if (!name.includes("@")) {
          return `"${actionName}@v4"`
        }
        return `"${name}"`
      }
      
      return `"${name}"`
    }

    Ecore["ecore_ifthenelse"] = (block: any) => {
      const condition = block.getFieldValue("ATTR_CONDITION") || "true"
    
      // Get connected blocks
      const trueBlock = block.getInputTargetBlock("CONT_TRUE")
      const falseBlock = block.getInputTargetBlock("CONT_FALSE")
    
      // Generate code for GitHub Actions if conditions
      let code = ""
    
      // Add true branch if present
      if (trueBlock) {
        // Generate code for the true branch
        let trueCode = window.Blockly.Ecore.blockToCode(trueBlock)
        
        // Insert the condition after each "- name:" line
        const lines = trueCode.split('\n')
        let processedCode = ""
        
        for (let i = 0; i < lines.length; i++) {
          processedCode += lines[i] + '\n'
          
          // If this is a "- name:" line, add the condition on the next line
          if (lines[i].trim().startsWith('- name:') && i + 1 < lines.length) {
            // Insert condition before the next line (which is typically 'uses:' or 'run:')
            processedCode += `        if: ${condition}\n`
          }
        }
        
        code += processedCode
      }
    
      // Add false branch if present
      if (falseBlock) {
        // Generate code for the false branch, with inverted condition
        const invertedCondition = `!(${condition})`
        let falseCode = window.Blockly.Ecore.blockToCode(falseBlock)
        
        // Insert the inverted condition after each "- name:" line
        const lines = falseCode.split('\n')
        let processedCode = ""
        
        for (let i = 0; i < lines.length; i++) {
          processedCode += lines[i] + '\n'
          
          // If this is a "- name:" line, add the inverted condition on the next line
          if (lines[i].trim().startsWith('- name:') && i + 1 < lines.length) {
            // Insert inverted condition before the next line (which is typically 'uses:' or 'run:')
            processedCode += `        if: ${invertedCondition}\n`
          }
        }
        
        code += processedCode
      }
    
      // Check for next block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }
    
      return code
    }
    
    Ecore["ecore_if"] = (block: any) => {
      // Get connected blocks
      const commandBlock = block.getInputTargetBlock("CONT_COMMAND")
      const ifThenElseBlock = block.getInputTargetBlock("CONT_IFTHENELSE")
    
      // Generate code
      let code = ""
    
      // Add command blocks if present
      if (commandBlock) {
        const commandCode = window.Blockly.Ecore.blockToCode(commandBlock)
        code += commandCode
      }
    
      // Add ifThenElse blocks if present
      if (ifThenElseBlock) {
        const ifThenElseCode = window.Blockly.Ecore.blockToCode(ifThenElseBlock)
        code += ifThenElseCode
      }
    
      return code
    }
    
    Ecore["ecore_else"] = (block: any) => {
      // Get connected blocks
      const commandBlock = block.getInputTargetBlock("CONT_COMMAND")
      const ifThenElseBlock = block.getInputTargetBlock("CONT_IFTHENELSE")
    
      // Generate code
      let code = ""
    
      // Add command blocks if present
      if (commandBlock) {
        const commandCode = window.Blockly.Ecore.blockToCode(commandBlock)
        code += commandCode
      }
    
      // Add ifThenElse blocks if present
      if (ifThenElseBlock) {
        const ifThenElseCode = window.Blockly.Ecore.blockToCode(ifThenElseBlock)
        code += ifThenElseCode
      }
    
      return code
    }
    
    // Parameter block generator
    Ecore["ecore_parameter"] = (block: any) => {
      const parameter = block.getFieldValue("ATTR_PARAMETER") || "param"
      
      // Get the parent block
      const parentBlock = block.getParent();
      
      // Check if parent is a command block and its tool is "|"
      let isShellCommand = false;
      if (parentBlock && parentBlock.type === "ecore_command") {
        const toolBlock = parentBlock.getInputTargetBlock("CONT_TOOL");
        if (toolBlock && toolBlock.type === "ecore_tool_value") {
          const toolName = toolBlock.getFieldValue("ATTR_NAME");
          isShellCommand = (toolName === "|");
        }
      }
      
      // Generate code with proper indentation based on parent
      let code;
      if (isShellCommand) {
        // For shell commands, each parameter is a new line of the script
        code = `${parameter}\n`;
      } else {
        // Regular parameter format for "with:" sections
        code = `          ${parameter}\n`;
      }

      // Check for next parameter block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }

      return code
    }

    // Permission block generator
    Ecore["ecore_permission"] = (block: any) => {
      const key = block.getFieldValue("ATTR_KEY") || "PERM_KEY"
      const value = block.getFieldValue("ATTR_VALUE") || "value"

      // Generate code with proper indentation
      let code = `  ${key}: ${value}\n`

      // Check for next permission block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += nextCode
      }

      return code
    }

    // If block generator


    // Job dependency block generator
    Ecore["ecore_job_dependency"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_job"

      // Start with the current job name
      let code = `"${name}"`

      // Check for next dependency block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += `, ${nextCode}`
      }

      return code
    }

    // Command dependency block generator
    Ecore["ecore_command_dependency"] = (block: any) => {
      const name = block.getFieldValue("ATTR_NAME") || "unnamed_command"

      // Start with the current command name
      let code = `"${name}"`

      // Check for next dependency block
      const nextBlock = block.getNextBlock()
      if (nextBlock) {
        const nextCode = window.Blockly.Ecore.blockToCode(nextBlock)
        code += `, ${nextCode}`
      }

      return code
    }

    // Add a blockToCode function to handle any block
    Ecore.blockToCode = (block: any) => {
      if (!block) {
        return ""
      }

      // Check if there's a generator for this block type
      if (Ecore[block.type]) {
        return Ecore[block.type](block)
      }

      // Default case if no generator is found
      console.warn(`No generator found for block type: ${block.type}`)
      return ""
    }
  }

  // Generate code from the workspace
  static generateCode(workspace: any): string {
    // Make sure generators are initialized
    this.init()

    // Get all top-level blocks
    const topBlocks = workspace.getTopBlocks(true)

    // Generate code for each top-level block
    let code = "# Generated CI/CD Pipeline YAML\n"
    code += "# This YAML is compatible with GitHub Actions\n\n"

    for (const block of topBlocks) {
      if (window.Blockly.Ecore[block.type]) {
        code += window.Blockly.Ecore.blockToCode(block)
      }
    }

    return code
  }
}

// Helper function to indent code
function indentCode(code: string, indentLevel: number): string {
  const indent = "  ".repeat(indentLevel)
  return code
    .split("\n")
    .map((line) => {
      if (line.trim() === "") return line
      return indent + line
    })
    .join("\n")
}

// Add Blockly to the window type
declare global {
  interface Window {
    Blockly: any
  }
}