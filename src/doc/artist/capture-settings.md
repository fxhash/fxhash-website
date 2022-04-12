---
title: 'Capture settings'
date: '2022-04-16'
description: 'A full documentation of the capture settings.'
---


When unique iterations are minted, fxhash signing module needs to generate some metadata to attach to the NFTs for them to appear as valid on the tezos ecosystem. Some part of the metadata is an image, and so the signing module needs to load your code in a webpage, and somehow extract a capture. Because there are a wide variety of projects, we propose some generic features to control this capture module.

There are 2 major steps for the capture:
* when is it triggered ?
* how is the image data extracted from the web document ?

# Trigger

The trigger defines when the capture module will take the preview after loading the token in a web browser:

* **Fixed delay**: Give it a delay of X seconds, and once the project is loaded, the capture module will wait X seconds before triggering the capture
* **fxpreview()**: The capture module will wait until your code calls `fxpreview()`. As soon as the function is called, the capture will be triggered. You can call this function whenever your algorithm is ready to be captured. *The capture module will automatically take a capture after 300 seconds have passed after your project was loaded in the browser.*

# Target

This option defines what will be targetted by the capture module.

* **From \<canvas\>**: capture module will directly grab the data of the canvas selected in the document with the CSS selector you provide. The preview will have the same size as the canvas.
* **Viewport capture**: the capture will be made on the whole viewport, set at the resolution you will provide.

## GPU-enabled rendering

There are 2 types of rendering instances to generate previews of tokens:

* **CPU only**: those are the default, and most scalable instances. They rely on a CPU fallback implementation for WebGL. They are suited for the majority of the projects
* **GPU-enabled**: those are instances with a GPU. They can render with a GPU, but they are way slower to bootstrap and so the time it takes to generate a capture is longer because of the bootstrap time.

For most of the cases, even if your project uses WebGL, CPU instances are better because we can scale a very high amount of instances, and so it doesn't bloat the rendering queue. However, in some cases, your project may need a GPU to render properly. **For now, we only have 4 instances available, and as a result the metadata assignation will be slower for projects using those GPU-enabled instances**.

You should **only use GPU-enabled instances** if:

* Your project doesn't render properly using regular instances

If you don't use WebGL and only the regular canvas API, it's also possible that your project doesn't render properly on the CPU instance because the canvas API uses GPU acceleration. If you observe differences between the capture and your live version, then try using GPU-enabled rendering.


# Recommendations

If your project is loading asynchronous requests from the project's folder, **always consider that one of those ressources may be slow to load**. In that regard, if you load resources please always use `fxpreview()` to trigger the capture.