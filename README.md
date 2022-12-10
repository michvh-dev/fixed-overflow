# @michvh-dev: Fixed overflow
> This is a small utilitie that gives the possibility to mask fixed elements when you scroll over different element
> Live demo [_here_](https://fixed-overflow.michvh.dev/example/).

## Table of Contents
* [General Info](#general-information)
* [Installation](#installation)
* [Usage](#usage)




## General Information
This js utility helps you to seamlesly update fixed elements


## Installation
### npm
```
npm i @michvh-dev/fixed-overfloww -S
```

### yarn
```
yarn add @michvh-dev/fixed-overflow
```

## Usage

```js
import FixedOverflow from '@michvh-dev//fixed-overfloww';

const elements= document.querySelectorAll('.header, .sidebar');
new FixedOverflow({
    element: elements,
});
// or 
new FixedOverflow({
    elementSelector: '.header, .sidebar',
});
```