import { type I18n } from '@lingui/core';
import { Text } from 'react-email';

type LogoProps = {
  i18n: I18n;
};

export const Logo = ({ i18n }: LogoProps) => (
  <Text
    aria-label={i18n._('crm logo')}
    style={{
      color: '#172554',
      fontSize: '32px',
      fontWeight: 700,
      marginBottom: '40px',
    }}
  >
    crm
  </Text>
);
