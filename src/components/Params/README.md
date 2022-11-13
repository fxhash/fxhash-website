# Params 

We are using a custom tweakpane react integration using react.context. You can register new ParameterDefinitions into the context that are used as the single source of truth. Those parameters are bound to one single "master" pane. You can register "sub" panes that just register a listener on the "master" pane changes and changes on the "sub" pane are broadcasted to the "master" pane. This way we maintain a very performant two directional parameter update flow. 

## `/Params/tweakpane/index` 

This file contains the custom configuration for tweakpane that we use in fx(hash). It adds plugins that serve our special needs for the fx(params), e.g. StringInput with maxLength constrain. Use `createFxPane` to create a new tweakpane with configuraiton for fx(params).

## `/Params/plugins`

Contains the different tweakpane plugins. e.g Input with maxLength constrain

## `/Params/Pane.tsx`

Pane component renders a new pane into a div. It only displays parameters that are provided via id in the `params` prop.
