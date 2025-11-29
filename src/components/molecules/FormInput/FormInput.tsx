import React from 'react';
import { View } from 'react-native';
import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { InputProps } from '@/components/atoms/Input/Input.types';

export interface FormInputProps<T extends FieldValues> extends Omit<InputProps, 'value' | 'onChangeText' | 'error'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  rules?: RegisterOptions<T>;
}

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  rules,
  ...inputProps
}: FormInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          {label && (
            <Text variant="small" className={`mb-2 ${inputProps.variant === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              {label}
              {required && <Text className="text-red-500"> *</Text>}
            </Text>
          )}
          <Input
            value={value || ''}
            onChangeText={onChange}
            error={error?.message}
            {...inputProps}
          />
        </View>
      )}
    />
  );
};

