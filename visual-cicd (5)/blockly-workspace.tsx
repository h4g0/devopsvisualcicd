"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { ECORE_BLOCKS, ECORE_TOOLBOX } from "./ecore-blocks"
import { EcoreGenerator } from "./blockly-code-generator"

// Define props interface
interface BlocklyWorkspaceProps {
  onChange?: (xml: string, code: string) => void
  initialXml?: string
}

// This component will be loaded dynamically to avoid SSR issues with Blockly
const BlocklyWorkspace: React.FC<BlocklyWorkspaceProps> = ({ onChange, initialXml }) => {
  const blocklyDiv = useRef<HTMLDivElement>(null)
  const [workspace, setWorkspace] = useState<any>(null)
  const [blocklyLoaded, setBlocklyLoaded] = useState(false)

  // Initialize Blockly after the script has loaded
  const initBlockly = () => {
    if (!blocklyDiv.current || !window.Blockly) return

    try {
      console.log("Initializing Blockly...", window.Blockly)

      // Register custom blocks
      ECORE_BLOCKS.forEach((block) => {
        window.Blockly.Blocks[block.type] = {
          init: function () {
            this.jsonInit(block)
          },
        }
      })

      // Create workspace with responsive settings
      const newWorkspace = window.Blockly.inject(blocklyDiv.current, {
        toolbox: ECORE_TOOLBOX,
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: window.innerWidth < 768 ? 0.7 : 1.0, // Smaller scale on mobile
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
        trashcan: true,
        scrollbars: true,
        sounds: false, // Disable sounds for better mobile experience
        move: {
          scrollbars: true,
          drag: true,
          wheel: true,
        },
        // Enable strict type checking
        typeCheck: true,
      })

      // Load initial XML if provided
      if (initialXml) {
        const xml = window.Blockly.Xml.textToDom(initialXml)
        window.Blockly.Xml.domToWorkspace(xml, newWorkspace)
      } else {
        // Add a default pipeline block if no XML is provided
        const defaultBlock = newWorkspace.newBlock("ecore_pipeline")
        defaultBlock.initSvg()
        defaultBlock.render()
        defaultBlock.moveBy(50, 50)
      }

      // Set up change listener
      if (onChange) {
        newWorkspace.addChangeListener(() => {
          const xml = window.Blockly.Xml.workspaceToDom(newWorkspace)
          const xmlText = window.Blockly.Xml.domToText(xml)

          // Generate code using our custom generator
          const code = EcoreGenerator.generateCode(newWorkspace)

          onChange(xmlText, code)
        })
      }

      // Handle window resize
      const handleResize = () => {
        window.Blockly.svgResize(newWorkspace)
      }

      window.addEventListener("resize", handleResize)

      // Store workspace for cleanup
      setWorkspace(newWorkspace)

      // Return cleanup function for resize handler
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    } catch (error) {
      console.error("Error initializing Blockly:", error)
    }
  }

  // Handle script load event
  const handleScriptLoad = () => {
    console.log("Blockly script loaded")
    setBlocklyLoaded(true)
    initBlockly()
  }

  // Initialize Blockly when the component mounts and the script is loaded
  useEffect(() => {
    if (blocklyLoaded && blocklyDiv.current && !workspace) {
      try {
        console.log("Initializing Blockly...", window.Blockly)

        // Register custom blocks
        ECORE_BLOCKS.forEach((block) => {
          window.Blockly.Blocks[block.type] = {
            init: function () {
              this.jsonInit(block)
            },
          }
        })

        // Create workspace with responsive settings
        const newWorkspace = window.Blockly.inject(blocklyDiv.current, {
          toolbox: ECORE_TOOLBOX,
          grid: {
            spacing: 20,
            length: 3,
            colour: "#ccc",
            snap: true,
          },
          zoom: {
            controls: true,
            wheel: true,
            startScale: window.innerWidth < 768 ? 0.7 : 1.0, // Smaller scale on mobile
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
          },
          trashcan: true,
          scrollbars: true,
          sounds: false, // Disable sounds for better mobile experience
          move: {
            scrollbars: true,
            drag: true,
            wheel: true,
          },
          // Enable strict type checking
          typeCheck: true,
        })

        // Load initial XML if provided
        if (initialXml) {
          const xml = window.Blockly.Xml.textToDom(initialXml)
          window.Blockly.Xml.domToWorkspace(xml, newWorkspace)
        } else {
          // Add a default pipeline block if no XML is provided
          const defaultBlock = newWorkspace.newBlock("ecore_pipeline")
          defaultBlock.initSvg()
          defaultBlock.render()
          defaultBlock.moveBy(50, 50)
        }

        // Initialize the code generator
        if (window.Blockly.Ecore === undefined) {
          EcoreGenerator.init()
        }

        // Set up change listener with debounce to prevent rapid updates
        let changeTimeout: NodeJS.Timeout | null = null
        if (onChange) {
          newWorkspace.addChangeListener((event: any) => {
            // Only process events that change the workspace content
            if (
              event.type === window.Blockly.Events.BLOCK_MOVE ||
              event.type === window.Blockly.Events.BLOCK_CHANGE ||
              event.type === window.Blockly.Events.BLOCK_CREATE ||
              event.type === window.Blockly.Events.BLOCK_DELETE
            ) {
              // Clear previous timeout
              if (changeTimeout) {
                clearTimeout(changeTimeout)
              }

              // Set new timeout to debounce rapid changes
              changeTimeout = setTimeout(() => {
                const xml = window.Blockly.Xml.workspaceToDom(newWorkspace)
                const xmlText = window.Blockly.Xml.domToText(xml)

                // Generate code using our custom generator
                const code = EcoreGenerator.generateCode(newWorkspace)

                onChange(xmlText, code)
              }, 300)
            }
          })
        }

        // Handle window resize
        const handleResize = () => {
          window.Blockly.svgResize(newWorkspace)
        }

        window.addEventListener("resize", handleResize)

        // Store workspace for cleanup
        setWorkspace(newWorkspace)

        // Return cleanup function
        return () => {
          window.removeEventListener("resize", handleResize)
          if (changeTimeout) {
            clearTimeout(changeTimeout)
          }
          if (newWorkspace) {
            newWorkspace.dispose()
          }
        }
      } catch (error) {
        console.error("Error initializing Blockly:", error)
      }
    }
  }, [blocklyLoaded, blocklyDiv, workspace, initialXml, onChange])

  return (
    <>
      <Script
        src="https://unpkg.com/blockly/blockly.min.js"
        onLoad={handleScriptLoad}
        onError={(e) => console.error("Error loading Blockly script:", e)}
        strategy="afterInteractive"
      />
      <div ref={blocklyDiv} className="w-full h-full min-h-[300px] sm:min-h-[400px]" />
    </>
  )
}

export default BlocklyWorkspace

