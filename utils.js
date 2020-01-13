/**
 * @flow
 */

import Animated from 'react-native-reanimated';
import { Dimensions } from 'react-native';

/** AUTHOR: WCANDILLION **/

// Pre-calculate Device Dimensions for better performance
const x = Dimensions.get('window').width;

// Calculating ratio from iPhone breakpoints
const ratioX = x < 375 ? (x < 320 ? 0.75 : 0.875) : 1 ;

// We set our base font size value
const base_unit = 16;

// We're simulating EM by changing font size according to Ratio
const unit = base_unit * ratioX;

// We add an em() shortcut function
export function em(value) {
    return unit * value;
}

const {
    Value, cond, add, sub, divide, abs,
    greaterOrEq, multiply, lessThan,
} = Animated;

const { PI } = Math;

type MixedValue = Value | number;

export const toRad = (deg: MixedValue): MixedValue => multiply(deg, PI / 180);
export const toDeg = (rad: MixedValue): MixedValue => multiply(rad, 180 / PI);
//
// https://stackoverflow.com/questions/42537957/fast-accurate-atan-arctan-approximation-algorithm
export const atan = (x: Value): Value => sub(
    multiply(PI / 4, x),
    multiply(multiply(x, sub(abs(x), 1)), add(0.2447, multiply(0.0663, abs(x)))),
);
//
// https://en.wikipedia.org/wiki/Atan2
// https://www.gamedev.net/forums/topic/441464-manually-implementing-atan2-or-atan/
export const atan2 = (y: Value, x: Value): Value => {
    const coeff1 = PI / 4;
    const coeff2 = 3 * coeff1;
    const absY = abs(y);
    const angle = cond(greaterOrEq(x, 0), [
        sub(coeff1, multiply(coeff1, divide(sub(x, absY), add(x, absY)))),
    ], [
        sub(coeff2, multiply(coeff1, divide(add(x, absY), sub(absY, x)))),
    ]);
    return cond(lessThan(y, 0), multiply(angle, -1), angle);
};

/** MY FUNCTIONS **/
export const fromValueToPer = (value, max) => (max !== 0 ? value * 100 / max : 0);
export const fromPerToRad = (per) => ((per * ((PI + PI * 0.4) / 100)));
export const fromRadToProgress = (rad, offset) => {
    let desp = 0, always = -1 * PI * 0.2;
    if (offset > 0) {
        desp = offset
    } else if (offset < 0) {
        desp = PI * 0.2 - offset
    }
    return rad + desp + always;
};

export const calculateDelta = (beta, alpha) => {
    if (alpha < 0) {
        if (alpha > PI / -2) {
        } else {
            alpha = 2 * PI + alpha
        }
    }
    return beta - alpha
};
export const fromRadToPer = (rad) => ((rad / ((PI + PI * 0.4) / 100)));
export const fromPerToVal = (per, max) => (per * max / 100);
export const getLargeArcValue = (end, start, isAdvanced, angle) => {
    if (start < 0) start = 2 * PI + start;
    if(!isAdvanced) {
        if (angle < 0 && start - end <= PI) {
            start = start - 0.2 * PI;
        }
        return start > PI ? '1' : '0'
    } else {
        if (angle >= 0 && angle < PI) {
            start = 2 * PI + start
        }
    }
    return end - start > -1 * PI ? '0' : '1'
};
