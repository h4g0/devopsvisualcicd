// Custom Ecore model blocks for Blockly
export const ECORE_BLOCKS = [
  {
    type: "ecore_pipeline",
    message0: "%1 \n Name: %2 \n Concurrent: %3 \n when %4 job %5 tool %6 environment %7 permission %8",
    colour: 230,
    tooltip: "Pipeline class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Pipeline",
      },
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
      {
        type: "field_checkbox",
        name: "ATTR_CONCURRENT",
        checked: false,
      },
      {
        type: "input_statement",
        name: "CONT_WHEN",
        check: "ecore_when",
      },
      {
        type: "input_statement",
        name: "CONT_JOB",
        check: "ecore_job",
      },
      {
        type: "input_statement",
        name: "CONT_TOOL",
        check: "ecore_tool",
      },
      {
        type: "input_statement",
        name: "CONT_ENVIRONMENT",
        check: "ecore_environment",
      },
      {
        type: "input_statement",
        name: "CONT_PERMISSION",
        check: "ecore_permission",
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "ecore_job",
    message0:
      "%1 \n Name: %2 \n AllowFailure: %3 \n Description: %4 \n tool %5 command %6 ifthenelse %7 input %8 environment %9 permission %10 output (multiple): %11 \n depends (multiple): %12",
    colour: 160,
    tooltip: "Job class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Job",
      },
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
      {
        type: "field_checkbox",
        name: "ATTR_ALLOWFAILURE",
        checked: false,
      },
      {
        type: "field_input",
        name: "ATTR_DESCRIPTION",
        text: "",
      },
      {
        type: "input_statement",
        name: "CONT_TOOL",
        check: "ecore_tool",
      },
      {
        type: "input_statement",
        name: "CONT_COMMAND",
        check: "ecore_command",
      },
      {
        type: "input_statement",
        name: "CONT_IFTHENELSE",
        check: "ecore_ifthenelse",
      },
      {
        type: "input_statement",
        name: "CONT_INPUT",
        check: "ecore_artifact",
      },
      {
        type: "input_statement",
        name: "CONT_ENVIRONMENT",
        check: "ecore_environment",
      },
      {
        type: "input_statement",
        name: "CONT_PERMISSION",
        check: "ecore_permission",
      },
      {
        type: "input_value",
        name: "REL_OUTPUT",
        check: "ecore_artifact_value",
      },
      {
        type: "input_statement",
        name: "REL_DEPENDS",
        check: "ecore_job_dependency",
      },
    ],
    previousStatement: "ecore_job",
    nextStatement: "ecore_job",
  },
  // Value-only version of job for references
  {
    type: "ecore_job_value",
    message0: "Job: %1",
    colour: 160,
    tooltip: "Job reference",
    helpUrl: "",
    args0: [
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
    ],
    output: "ecore_job_value",
  },
  {
    type: "ecore_command",
    message0: "%1 Name: %2 tool: %3 parameter %4 depends (multiple): %5",
    colour: 290,
    tooltip: "Command class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Command",
      },
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
      {
        type: "input_value",
        name: "CONT_TOOL",
        check: "ecore_tool_value",
      },
      {
        type: "input_statement",
        name: "CONT_PARAMETER",
        check: "ecore_parameter",
      },
      {
        type: "input_statement",
        name: "REL_DEPENDS",
        check: "ecore_command_dependency",
      },
    ],
    previousStatement: "ecore_command",
    nextStatement: "ecore_command",
  },
  // Value-only version of command for references
  {
    type: "ecore_command_value",
    message0: "Command: %1",
    colour: 290,
    tooltip: "Command reference",
    helpUrl: "",
    args0: [
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
    ],
    output: "ecore_command_value",
  },
  {
    type: "ecore_environment",
    message0: "%1 \n Key: %2 Value: %3",
    colour: 120,
    tooltip: "Environment class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Environment",
      },
      {
        type: "field_input",
        name: "ATTR_KEY",
        text: "",
      },
      {
        type: "field_input",
        name: "ATTR_VALUE",
        text: "",
      },
    ],
    previousStatement: "ecore_environment",
    nextStatement: "ecore_environment",
  },
  {
    type: "ecore_when",
    message0: "%1 Name: %2 Trigger: %3 Timer: %4",
    colour: 65,
    tooltip: "When class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "When",
      },
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
      {
        type: "field_input",
        name: "ATTR_TRIGGER",
        text: "",
      },
      {
        type: "field_input",
        name: "ATTR_TIMER",
        text: "",
      },
    ],
    previousStatement: "ecore_when",
    nextStatement: "ecore_when",
  },
  {
    type: "ecore_artifact",
    message0: "%1 Name: %2",
    colour: 210,
    tooltip: "Artifact class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Artifact",
      },
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
    ],
    previousStatement: "ecore_artifact",
    nextStatement: "ecore_artifact",
  },
  // Value-only version of artifact for references
  {
    type: "ecore_artifact_value",
    message0: "Artifact: %1",
    colour: 210,
    tooltip: "Artifact reference",
    helpUrl: "",
    args0: [
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
    ],
    output: "ecore_artifact_value",
  },
  {
    type: "ecore_tool",
    message0: "%1 Name: %2",
    colour: 20,
    tooltip: "Tool class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Tool",
      },
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
    ],
    previousStatement: "ecore_tool",
    nextStatement: "ecore_tool",
  },
  // Value-only version of tool for references
  {
    type: "ecore_tool_value",
    message0: "Tool: %1",
    colour: 20,
    tooltip: "Tool reference",
    helpUrl: "",
    args0: [
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
    ],
    output: "ecore_tool_value",
  },
  {
    type: "ecore_ifthenelse",
    message0: "%1 Condition: %2 true: %3 false: %4",
    colour: 330,
    tooltip: "IfThenElse class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "IfThenElse",
      },
      {
        type: "field_input",
        name: "ATTR_CONDITION",
        text: "",
      },
      {
        type: "input_value",
        name: "CONT_TRUE",
        check: "ecore_if",
      },
      {
        type: "input_value",
        name: "CONT_FALSE",
        check: "ecore_else",
      },
    ],
    previousStatement: "ecore_ifthenelse",
    nextStatement: "ecore_ifthenelse",
  },
  {
    type: "ecore_parameter",
    message0: "%1 Parameter: %2",
    colour: 180,
    tooltip: "Parameter class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Parameter",
      },
      {
        type: "field_input",
        name: "ATTR_PARAMETER",
        text: "",
      },
    ],
    previousStatement: "ecore_parameter",
    nextStatement: "ecore_parameter",
  },
  {
    type: "ecore_permission",
    message0: "%1 Key: %2 Value: %3",
    colour: 260,
    tooltip: "Permission class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Permission",
      },
      {
        type: "field_input",
        name: "ATTR_KEY",
        text: "",
      },
      {
        type: "field_input",
        name: "ATTR_VALUE",
        text: "",
      },
    ],
    previousStatement: "ecore_permission",
    nextStatement: "ecore_permission",
  },
  {
    type: "ecore_if",
    message0: "%1 command %2 ifthenelse %3",
    colour: 330,
    tooltip: "If class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "If",
      },
      {
        type: "input_statement",
        name: "CONT_COMMAND",
        check: "ecore_command",
      },
      {
        type: "input_statement",
        name: "CONT_IFTHENELSE",
        check: "ecore_ifthenelse",
      },
    ],
    output: "ecore_if",
  },
  {
    type: "ecore_else",
    message0: "%1 command %2 ifthenelse %3",
    colour: 330,
    tooltip: "Else class from Ecore model",
    helpUrl: "",
    args0: [
      {
        type: "field_label",
        name: "CLASS_LABEL",
        text: "Else",
      },
      {
        type: "input_statement",
        name: "CONT_COMMAND",
        check: "ecore_command",
      },
      {
        type: "input_statement",
        name: "CONT_IFTHENELSE",
        check: "ecore_ifthenelse",
      },
    ],
    output: "ecore_else",
  },
  {
    type: "ecore_job_dependency",
    message0: "Depends on job: %1",
    colour: 160,
    tooltip: "Job dependency",
    helpUrl: "",
    args0: [
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
    ],
    previousStatement: "ecore_job_dependency",
    nextStatement: "ecore_job_dependency",
  },
  {
    type: "ecore_command_dependency",
    message0: "Depends on command: %1",
    colour: 290,
    tooltip: "Command dependency",
    helpUrl: "",
    args0: [
      {
        type: "field_input",
        name: "ATTR_NAME",
        text: "",
      },
    ],
    previousStatement: "ecore_command_dependency",
    nextStatement: "ecore_command_dependency",
  },
]

// Modify the ECORE_TOOLBOX to reorder the blocks and remove the value blocks
export const ECORE_TOOLBOX = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "block",
      type: "ecore_pipeline",
    },
    {
      kind: "block",
      type: "ecore_job",
    },
    {
      kind: "block",
      type: "ecore_job_dependency",
    },
    {
      kind: "block",
      type: "ecore_command",
    },
    {
      kind: "block",
      type: "ecore_command_dependency",
    },
    {
      kind: "block",
      type: "ecore_tool",
    },
    {
      kind: "block",
      type: "ecore_tool_value",
    },
    {
      kind: "block",
      type: "ecore_environment",
    },
    {
      kind: "block",
      type: "ecore_permission",
    },
    {
      kind: "block",
      type: "ecore_parameter",
    },
    {
      kind: "block",
      type: "ecore_artifact",
    },
    {
      kind: "block",
      type: "ecore_artifact_value",
    },
    {
      kind: "block",
      type: "ecore_when",
    },
    {
      kind: "block",
      type: "ecore_ifthenelse",
    },
    {
      kind: "block",
      type: "ecore_if",
    },
    {
      kind: "block",
      type: "ecore_else",
    },
  ],
}

