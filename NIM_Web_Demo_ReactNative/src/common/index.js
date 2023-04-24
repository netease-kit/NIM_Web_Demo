import { Dimensions, PixelRatio } from 'react-native';

export const deviceWidth = Dimensions.get('window').width; // 设备的宽度
export const deviceHeight = Dimensions.get('window').height; // 设备的高度
const fontScale = PixelRatio.getFontScale(); // 返回字体大小缩放比例
const pixelRatio = PixelRatio.get(); // 当前设备的像素密度

export const RVW = deviceWidth / 100;
export const RVH = deviceHeight / 100;
export const RFT = RVW / fontScale;
export const RPX = 1 / pixelRatio;
