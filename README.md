Moro
====

[![Join the chat at https://gitter.im/wolfe-pack/moro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/wolfe-pack/moro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/wolfe-pack/moro.svg?branch=master)](https://travis-ci.org/wolfe-pack/moro)

Interactive documentation and programming with Scala, inspired by IPython notebook.

Installation
---

```
git clone https://github.com/wolfe-pack/moro.git
cd moro; sbt clean run
```

For more details, see the [following Wiki](https://github.com/wolfe-pack/moro/wiki/Setting-up-on-new-machines).

Wolfe Documentation
---

To run the wolfe documentation locally, afer cloning Moro, do the following:

1. `cd public/docs`
1. `git clone https://github.com/wolfe-pack/wolfe-docs.git`
1. `cd ../..; sbt clean run`
1. Go to [http://localhost:9000/template/wolfe/wolfe-docs/gettingstarted/01_welcome](http://localhost:9000/template/wolfe/wolfe-docs/gettingstarted/01_welcome)
1. Enjoy!

Open Source Projects
---
Moro is built using the following awesome open-source projects:
* [Play! Framework](http://playframework.com): Web applications using Scala
* [Bootstrap](http://getbootstrap.com): Nice looking websites!
* [Glyphicons](http://glyphicons.com/) and [FontAwesome](http://fortawesome.github.io/Font-Awesome/) for icons
* [ACE](http://ace.c9.io/#nav=about): in-browser code editor
* [Hightlight.js](https://highlightjs.org/): syntax highlighting
* [Reveal.js](http://lab.hakim.se/reveal-js/#/): HTML presentations
* [TogetherJS](https://togetherjs.com): real-time collaboration without plugins
* [SecureSocial](http://securesocial.ws/): user authentication for Play!
* [Pegdown](http://pegdown.org): markdown processor in Java
* [ScalaKata](http://scalakata.com): In-browser Scala REPL
* [MathJax](http://www.mathjax.org/): Latex math to HTML rendering
