/**
 * Sanitizes props to ensure boolean values are actual booleans, not strings
 * This prevents "java.lang.String cannot be cast to java.lang.Boolean" errors on Android
 */
export const sanitizeProps = <T extends Record<string, any>>(props: T): T => {
  const sanitized = { ...props };
  
  // List of known boolean props in React Native
  const booleanProps = [
    'disabled',
    'accessible',
    'accessibilityElementsHidden',
    'accessibilityViewIsModal',
    'collapsable',
    'focusable',
    'importantForAccessibility',
    'needsOffscreenAlphaCompositing',
    'renderToHardwareTextureAndroid',
    'shouldRasterizeIOS',
    'tvParallaxProperties',
    'editable',
    'secureTextEntry',
    'multiline',
    'autoFocus',
    'selectTextOnFocus',
    'blurOnSubmit',
    'clearButtonMode',
    'clearTextOnFocus',
    'keyboardType',
    'returnKeyType',
    'enablesReturnKeyAutomatically',
    'secureTextEntry',
    'password',
    'autoCorrect',
    'autoCapitalize',
    'spellCheck',
    'keyboardAppearance',
    'showSoftInputOnFocus',
    'textContentType',
    'value',
    'checked',
    'loading',
    'fullWidth',
  ];

  for (const key in sanitized) {
    if (booleanProps.includes(key)) {
      const value = sanitized[key];
      if (typeof value === 'string') {
        sanitized[key] = value === 'true';
      } else if (value !== undefined && value !== null) {
        sanitized[key] = Boolean(value);
      }
    }
  }

  return sanitized;
};

/**
 * Ensures className is always a string, never a boolean or undefined
 * This prevents NativeWind from passing boolean values to native components
 */
export const sanitizeClassName = (className: string | undefined | null | boolean): string => {
  if (typeof className === 'boolean') {
    return '';
  }
  if (className === null || className === undefined) {
    return '';
  }
  return String(className);
};

/**
 * Safely combines className strings, ensuring the result is always a string
 */
export const combineClassNames = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes
    .map(sanitizeClassName)
    .filter(cls => cls.trim() !== '')
    .join(' ')
    .trim();
};

