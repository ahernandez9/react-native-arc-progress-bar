# react-native-arc-progress-bar
Customizable progress arc with an animated cursor to modify the progress in it. 
This project is in continuous development, and new functionalities will be considered if an issue is opened.

Behaviour is consistent in both Android and iOS.

[![ezgif.com-crop5a80f8b0da1dab2d.gif](https://s5.gifyu.com/images/ezgif.com-crop5a80f8b0da1dab2d.gif)](https://gifyu.com/image/mYqU)


## Features

* Easy to use
* Consistent look and feel on iOS and Android
* Customizable font size, colors, and overall components dimensions and behaviour
* Dynamic dropdown size and position
* Configurable styles and views for numbers and texts


## Installation

```bash
npm install --save react-native-arc-progress-bar react-native-svg
```

## Usage

```javascript
import React, { useState } from 'react';
import { View } from 'react-native';
import ArcProgressBar, { resolveNewValue } from 'react-native-arc-progress-bar';

const Example = () => {
    const [state, setState] = useState(250);

    const [scrollableMax, absoluteMax] = [800, 2000];
    const onChange = ([alpha, beta]) => {
        setState(resolveNewValue(alpha, beta, absoluteMax, scrollableMax));
    }

    return (
        <>
        <View style={{flex: 1}}>
            <ArcProgressBar
                rectangularSize={250}
                lowerValue={100}
                stackedValue={state}
                maxValue={scrollableMax}
                absoluteMaxValue={absoluteMax}
                showCursor
                showMinMax
                minStyle={{textAlign: "center"}}
                maxStyle={{textAlign: "center"}}
                caption1Text={"MAX\n"}
                caption2Text={"\nMIN"}
                showMin
                showMax
                onChange={onChange}
            />
        </View>
        <View style={{flex: 1}} />
        </>
    );
};

export default Example;
```
            
## Properties

 name              | description                                   | type     | default
:----------------- |:--------------------------------------------- | --------:|:------------------
 rectangularSize*   | Size of the component                         |   Number | -
 strokeWidth       | Width of the bar                              |   Number | -
 containerStyle    | Styles for container view                     |   Object | -
 progressStyle     | Styles for arc bar view                       |   Object | -
 minMaxStyle       | Styles for min|max view                       |   Object | -
 captionStyle      | Styles for component caption view             |   Object | -
 cursorStyle       | Styles for animated cursor view               |   Object | -
 maxStyle          | Styles for inner upper caption view           |   Object | -
 minStyle          | Styles for inner lower caption view           |   Object | -
 maxNumberStyle    | Styles for inner upper number                 |   Object | -
 minNumberStyle    | Styles for inner lower number                 |   Object | -
 showMinMax        | Show full inner caption                       |   Boolean | False
 showCursor        | Show animated cursor (if false, no onChange function should be added                          |   Boolean | True
 showMax           | Show max caption                              |   Boolean | False
 showMin           | Show min caption                              |   Boolean | False
 absoluteMaxValue* | Max value of the whole bar                    |   Number  | -
 lowerValue*       | Lower value of the animated bar               |   Number | -
 stackedValue*     | Current value of the animated bar             |   Number | -
 maxValue          | Max possible value of the animated bar        |   Number | -
 maxText           | Text for inner upper caption                  |   String | -
 minText           | Text for inner lower caption                  |   String | -
 primaryColor      | Color for animated bar                        |   Hex color | #047FF9
 shadowColor       | Color for the shadow of the animated bar      |   Hex color | #BFDEFD
 onChange          | Callback with new cursor value (args: value)  | Function | -


## Copyright

Copyright 2019-2020 Alberto Hernandez. All rights reserved.
