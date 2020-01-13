import React from 'react';
import { StyleSheet } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

//Manager
import { atan2 } from "./utils";

const {
    Value, event, block, cond, eq, set, add, sub, multiply, sin,
    cos, call
} = Animated;

/**
 * @param props
 * radius,
 * angle (current cursor angle in normal coordinates),
 * alpha (starting position of the cursor),
 * beta (left limit of the cursor)
 * @returns {*}
 */

export default (props) => {
    const { radius, alpha, beta, onAvailableChange } = props;

    const initialX  = Math.cos(alpha) * radius + radius;
    const initialY  = Math.sin(alpha) * radius * -1 + radius;

    const animatedAlpha   = new Value(0);
    const animatedBeta    = new Value(beta);

    const offsetX   = new Value(initialX);
    const offsetY   = new Value(initialY);
    const x         = new Value(initialX);
    const y         = new Value(initialY);
    const translationX = new Value(initialX);
    const translationY = new Value(initialY);
    const state = new Value(State.UNDETERMINED);
    const translateX = new Value(initialX);
    const translateY = new Value(initialY);
    const onGestureEvent = event(
        [
            {
                nativeEvent: {
                    translationX,
                    translationY,
                    state
                }
            }
        ]
    );

    return (
        <>
            <Animated.Code>
                {
                    () => block([
                        cond(eq(state, State.ACTIVE), [
                            set(x, add(offsetX, translationX)),
                            set(y, add(offsetY, translationY)),
                            call([animatedAlpha, animatedBeta], onAvailableChange())
                        ]),
                        cond(eq(state, State.END), [
                            set(offsetX, x),
                            set(offsetY, y)
                        ]),
                        set(animatedAlpha, atan2(add(multiply(y, -1), radius), sub(x, radius))),
                        set(translateX, add(multiply(radius, cos(animatedAlpha)), radius)),
                        set(translateY, add(multiply(-1 * radius, sin(animatedAlpha)), radius)),
                    ])

                }
            </Animated.Code>
            <PanGestureHandler onHandlerStateChange={onGestureEvent} {...{ onGestureEvent }}>
                <Animated.View style={[
                    styles.container,
                    {
                        transform: [
                            { translateY },
                            { translateX }
                        ]
                    }
                ]}>

                </Animated.View>
            </PanGestureHandler>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#047FF9',
        borderWidth: 3,
        borderColor: 'white'
    }
});
