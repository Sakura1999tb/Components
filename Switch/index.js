import React from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
import { connect } from "react-redux";

class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      on_off: this.props.active,
    };
    this.config = {
      width:
        this.props.width && typeof this.props.width === "number"
          ? this.props.width
          : 44,
      height:
        this.props.height && typeof this.props.height === "number"
          ? this.props.height
          : 24,
    };
    this.transformValue = new Animated.Value(2);
  }

  componentDidMount() {
    if (this.state.on_off) {
      this.transform();
    } else {
      this.transformValue.setValue(this.config.width - this.config.height + 2);
      this.transformBack();
    }
    this.setState({ isUpdateView: !this.state.isUpdateView });
  }

  componentWillUnmount() {
    Animated.spring(this.transformValue).stop();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active) {
      this.setState(
        {
          on_off: this.props.active,
        },
        () => {
          if (this.state.on_off) {
            this.transform();
          } else {
            this.transformBack();
          }
        }
      );
    }
  }

  onToggle = () => {
    const { disable } = this.props;
    if (disable) {
      return;
    }
    this.setState({ on_off: !this.state.on_off }, () => {
      if (this.state.on_off) {
        this.transform();
      } else {
        this.transformBack();
      }
      typeof this.props.onChange === "function" &&
        this.props.onChange(this.state.on_off);
    });
  };

  transform = () => {
    Animated.spring(this.transformValue, {
      toValue: this.config.width - this.config.height + 2,
      tension: 60,
      easing: Easing.linear,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  transformBack = () => {
    Animated.spring(this.transformValue, {
      toValue: 0,
      tension: 60,
      easing: Easing.linear,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const { theme, disable, index } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: this.config.width,
          height: this.config.height - 4,
          borderRadius: this.config.height / 2,
          justifyContent: "center",
          backgroundColor: this.state.on_off
            ? theme.colors.colorSwitchSecond
            : theme.colors.colorSwitch,
          opacity: disable ? 0.4 : 1,
        }}
        disabled={disable}
        onPress={this.onToggle}
        testID={"btn_switch_toggle" + index || 0}
      >
        <Animated.View
          style={{
            width: this.config.height + 2,
            height: this.config.height + 2,
            borderRadius: this.config.height / 2,
            backgroundColor: theme.colors.appColorThird,
            transform: [{ translateX: this.transformValue }],
          }}
        />
      </TouchableOpacity>
    );
  }
}

export default connect((state) => {
  return { theme: state.theme };
})(Switch);

export const BaseSwitch = Switch;
export const _connect = (cp) =>
  connect((state) => {
    return { theme: state.theme };
  })(cp);
