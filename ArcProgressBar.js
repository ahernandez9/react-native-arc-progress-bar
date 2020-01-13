import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Svg, {Path} from "react-native-svg";
import Animated from "react-native-reanimated";

//Functions
import {
    fromValueToPer, fromPerToRad,
    fromRadToProgress, getLargeArcValue, em
} from "./utils";

//Components
import Cursor from './AnimatedCursor'

class ArcProgressBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            rectangularSize, strokeWidth,
            containerStyle, progressStyle,
            minMaxStyle, captionStyle,
            cursorStyle, onChange,
            maxStyle, minStyle,
            maxNumberStyle, minNumberStyle,
            showMinMax, showCursor,
            showMax, showMin,
            absoluteMaxValue, lowerValue,
            stackedValue, maxValue,
            caption1Text, caption2Text,
            primaryColor, shadowColor,
        } = this.props;

        const minMoney = 0;
        const maxMoney = absoluteMaxValue;

        const {PI, cos, sin} = Math;
        const r = (rectangularSize - strokeWidth) / 2;
        const cx = rectangularSize / 2;
        const cy = rectangularSize / 2;
        const A = PI + PI * 0.4;

        /**
         * Cada arco (de izquierda a derecha, de abajo a arriba) va desde endAngle hasta startAngle
         **/

            //Calculamos los radianes que va a ocupar arco con su correspondiente desplazamiento
            //Advanced
        const advPer = fromValueToPer(stackedValue, absoluteMaxValue);
        const advRad = fromPerToRad(advPer);
        const advConv = fromRadToProgress(advRad, 0);

        //Available
        const avPer = fromValueToPer(lowerValue, absoluteMaxValue);
        const avRad = fromPerToRad(avPer);
        const avConv = fromRadToProgress(avRad, advRad);

        //AvailableToMax
        const avToMPer = fromValueToPer(maxValue, absoluteMaxValue);
        const avToMRad = fromPerToRad(avToMPer);
        const avToMConv = fromRadToProgress(avToMRad, advRad);

        // Animated angle values
        const alpha = Math.PI - avConv; //End of AVAILABLE
        const beta = Math.PI - advRad + Math.PI * 0.2; //START of AVAILABLE

        //Container arc props
        const container = {
            startAngle: PI + PI * 0.2,
            endAngle: 2 * PI - PI * 0.2,
            get x1() {
                return cx - r * cos(this.startAngle)
            },
            get y1() {
                return -r * sin(this.startAngle) + cy
            },
            get x2() {
                return cx - r * cos(this.endAngle)
            },
            get y2() {
                return -r * sin(this.endAngle) + cy
            }
        };

        //Adelantados arc props
        const advanced = {
            startAngle: advConv,
            endAngle: 2 * PI - PI * 0.2,
            get x1() {
                return cx - r * cos(this.startAngle)
            },
            get y1() {
                return -r * sin(this.startAngle) + cy
            },
            get x2() {
                return cx - r * cos(this.endAngle)
            },
            get y2() {
                return -r * sin(this.endAngle) + cy
            }
        };

        //Disponibles arc props
        const available = {
            startAngle: avConv,
            endAngle: advConv,
            get x1() {
                return cx - r * cos(this.startAngle)
            },
            get y1() {
                return -r * sin(this.startAngle) + cy
            },
            get x2() {
                return cx - r * cos(this.endAngle)
            },
            get y2() {
                return -r * sin(this.endAngle) + cy
            }
        };

        //Max disponibles
        const availableToMax = {
            startAngle: avToMConv,
            endAngle: avConv,
            get x1() {
                return cx - r * cos(this.startAngle)
            },
            get y1() {
                return -r * sin(this.startAngle) + cy
            },
            get x2() {
                return cx - r * cos(this.endAngle)
            },
            get y2() {
                return -r * sin(this.endAngle) + cy
            }
        };

        //Large arc (>180)? 0 = NO | 1 = YES
        //Si beta es negativo, le sumamos 2PI a el valor de advance en radianes para conseguir la equivalencia positiva
        const laAd = getLargeArcValue(advanced.endAngle, beta < 0 ? 2 * PI + advRad : advConv, true, beta);
        //If advanced supera PI, le pasamos la conversion, si no, le pasamos los radianes sin convertir
        const laAv = getLargeArcValue(beta > PI ? advRad : advConv, beta > PI ? avRad : avConv, false, alpha);
        const laAvToM = availableToMax.startAngle - availableToMax.endAngle > PI ? '1' : '0';

        //ARC formulas
        const ad = `M ${advanced.x1} ${advanced.y1} A ${r} ${r} 0 ${laAd} 0 ${advanced.x2} ${advanced.y2}`;
        const c = `M ${container.x1} ${container.y1} A ${r} ${r} 0 1 0 ${container.x2} ${container.y2}`;
        const av = `M ${available.x1} ${available.y1} A ${r} ${r} 0 ${laAv} 0 ${available.x2} ${available.y2}`;
        const avToM = `M ${availableToMax.x1} ${availableToMax.y1} A ${r} ${r} 0 ${laAvToM} 0 ${availableToMax.x2} ${availableToMax.y2}`;

        const circumference = r * A;

        return (
            <View style={[styles.container, containerStyle]}>

                {/* Advanced | available */}
                <View style={[styles.advancedAvailableView, captionStyle]}>
                    {showMax &&
                    <Text style={[{color: shadowColor}, maxStyle]}>
                        <Text style={{fontSize: 11}}>
                            {caption1Text}
                        </Text>
                        <Text style={maxNumberStyle}>
                            {maxValue}
                        </Text>
                    </Text>
                    }

                    {showMin &&
                    <Text style={[{color: primaryColor}, minStyle]}>
                        <Text style={minNumberStyle}>
                            {lowerValue}
                        </Text>
                        <Text style={{fontSize: 11}}>
                            {caption2Text}
                        </Text>
                    </Text>
                    }

                </View>

                {/* ARC */}
                <Animated.View style={[styles.progressView, progressStyle]}>
                    <Svg width={rectangularSize} height={rectangularSize}>
                        <Path
                            stroke={'#F5F5F7'}
                            fill="none"
                            strokeDasharray={`${circumference}, ${circumference}`}
                            {...{d: c, strokeWidth}}
                        />
                        <Path
                            stroke={'lightGrey'}
                            fill="none"
                            strokeDasharray={`${circumference}, ${circumference}`}
                            {...{d: ad, strokeWidth}}
                        />
                        <Path
                            stroke={shadowColor}
                            strokeDasharray={`${circumference}, ${circumference}`}
                            {...{d: avToM, strokeWidth}}
                        />
                        <Path
                            stroke={primaryColor}
                            fill="none"
                            strokeDasharray={`${circumference}, ${circumference}`}
                            {...{d: av, strokeWidth}}
                        />
                    </Svg>
                </Animated.View>

                {/* Min | max */}
                {showMinMax &&
                <View style={[styles.minMaxView, minMaxStyle]}>
                    <Text style={styles.limitText}>
                        {minMoney}
                    </Text>
                    <Text style={styles.limitText}>
                        {maxMoney}
                    </Text>
                </View>
                }

                {/*Cursor*/}
                {showCursor &&
                <View style={[styles.cursorView, cursorStyle]}>
                    <Cursor
                        alpha={alpha}
                        beta={beta}
                        radius={r}
                        onChange={onChange}
                    />
                </View>
                }

            </View>
        );
    }
}

ArcProgressBar.defaultProps = {
    strokeWidth: 30,
    showMinMax: false,
    showCursor: true,
    showMin: false,
    showMax: false,
    primaryColor: '#047FF9',
    shadowColor: '#bfdefd',
};

ArcProgressBar.propTypes = {
    rectangularSize:        PropTypes.number.isRequired,
    absoluteMaxValue:       PropTypes.number.isRequired,
    maxValue:               PropTypes.number.isRequired,
    lowerValue:             PropTypes.number.isRequired,
    higherValue:            PropTypes.number.isRequired,
    stackedValue:           PropTypes.number.isRequired
};

const { width } = Dimensions.get("window");
const size = width - em(2.75) * 3;
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    minMaxView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        alignSelf: 'center',
        bottom: 5,
        width: '75%'
    },
    limitText: {
        color: 'lightGrey'
    },
    advancedAvailableView: {
        flexDirection: 'column',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size
    },
    cursorView: {
        width: size,
        height: size,
        alignItems: 'center',
    },
    progressView: {
        width: size,
        height: size,
        alignItems: 'center',
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center'
    }
});

export {ArcProgressBar};
