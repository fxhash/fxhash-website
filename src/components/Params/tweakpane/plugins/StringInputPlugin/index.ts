import {
  BaseInputParams,
  BindingTarget,
  CompositeConstraint,
  createRangeConstraint,
  createStepConstraint,
  InputBindingPlugin,
  ParamsParsers,
  parseParams,
  ValueMap,
  Constraint,
} from "@tweakpane/core"
import { FxStringInputController } from "./controller"

export interface IFxStringInputPluginParams extends BaseInputParams {
  view: "string"
  maxLength?: number
}

// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
//
// `InputBindingPlugin<In, Ex, P>` means...
// - The plugin receives the bound value as `Ex`,
// - converts `Ex` into `In` and holds it
// - P is the type of the parsed parameters
//
export const FxStringInputPlugin: InputBindingPlugin<
  string,
  string,
  IFxStringInputPluginParams
> = {
  id: "fx-string-input-template",

  // type: The plugin type.
  // - 'input': Input binding
  // - 'monitor': Monitor binding
  type: "input",

  accept(value: unknown, params: Record<string, unknown>) {
    if (typeof value !== "string") {
      return null
    }
    // Parse parameters object
    const p = ParamsParsers
    const result = parseParams<IFxStringInputPluginParams>(params, {
      // `view` option may be useful to provide a custom control for primitive values
      view: p.required.constant("string"),
      maxLength: p.optional.number,
    })
    if (!result) {
      return null
    }
    // Return a typed value and params to accept the user input
    return {
      initialValue: value,
      params: result,
    }
  },

  binding: {
    reader(_args) {
      return (exValue: unknown): string => {
        // Convert an external unknown value into the internal value
        return String(exValue)
      }
    },

    constraint(args) {
      // Create a value constraint from the user input
      const constraints: Constraint<string>[] = []
      // Use `CompositeConstraint` to combine multiple constraints
      return new CompositeConstraint(constraints)
    },

    writer(_args) {
      return (target: BindingTarget, inValue) => {
        // Use `target.write()` to write the primitive value to the target,
        // or `target.writeProperty()` to write a property of the target
        target.write(inValue)
      }
    },
  },

  controller(args) {
    // Create a controller for the plugin
    return new FxStringInputController(args.document, {
      value: args.value,
      props: ValueMap.fromObject({
        ...args.params,
      }),
      viewProps: args.viewProps,
      parser: (v) => v,
    })
  },
}

// Export your plugin(s) as constant `plugins`
export const plugins = [FxStringInputPlugin]
