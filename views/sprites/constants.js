// @ts-check

/**
 * @typedef {"pencil" | "eraser" | "fill" | "picker"} ToolType
 */

// The following declaration are weird but required for type checking
export const Tool = {
  Pencil: /** @type {"pencil"} */ ('pencil'),
  Eraser: /** @type {"eraser"} */ ('eraser'),
  Fill:   /** @type {"fill"} */ ('fill'),
  Picker: /** @type {"picker"} */ ('picker')
}