import { type I18n } from '@lingui/core';
import { Container } from 'react-email';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

type FooterProps = {
  i18n: I18n;
};

export const Footer = ({ i18n }: FooterProps) => (
  <Container style={{ marginTop: '12px' }}>
    <ShadowText>
      {i18n._('crm — your personal workspace')}
      <br />
      <Link
        href="https://github.com/ANSH-JAIN-0210/crm"
        value={i18n._('Project repository')}
      />
    </ShadowText>
  </Container>
);
