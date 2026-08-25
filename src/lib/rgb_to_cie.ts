// https://github.com/usolved/cie-rgb-converter/blob/master/cie_rgb_converter.js
export function rgb_to_cie(r: number, g: number, b: number) {
  //Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
  const red = r > 0.04045 ? Math.pow((r + 0.055) / (1.0 + 0.055), 2.4) : r / 12.92;
  const green = g > 0.04045 ? Math.pow((g + 0.055) / (1.0 + 0.055), 2.4) : g / 12.92;
  const blue = b > 0.04045 ? Math.pow((b + 0.055) / (1.0 + 0.055), 2.4) : b / 12.92;

  //RGB values to XYZ using the Wide RGB D65 conversion formula
  const X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
  const Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
  const Z = red * 0.000088 + green * 0.07231 + blue * 0.986039;

  //Calculate the xy values from the XYZ values
  let x = parseFloat((X / (X + Y + Z)).toFixed(4));
  let y = parseFloat((Y / (X + Y + Z)).toFixed(4));

  if (isNaN(x)) x = 0;

  if (isNaN(y)) y = 0;

  return [x, y];
}
