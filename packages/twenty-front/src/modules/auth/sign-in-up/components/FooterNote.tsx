import { styled } from '@linaria/react';
import { Trans } from '@lingui/react/macro';

import { useWorkspaceBypass } from '@/auth/sign-in-up/hooks/useWorkspaceBypass';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledContainer = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  text-align: center;
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: ${themeCssVariables.spacing[2]};

  &:hover {
    text-decoration: underline;
  }
`;

export const FooterNote = () => {
  const { shouldOfferBypass, shouldUseBypass, enableBypass } =
    useWorkspaceBypass();

  return (
    <StyledContainer>
      {shouldOfferBypass && !shouldUseBypass ? (
        <StyledButton type="button" onClick={enableBypass}>
          <Trans>Bypass SSO</Trans>
        </StyledButton>
      ) : (
        <Trans>Your personal CRM workspace</Trans>
      )}
    </StyledContainer>
  );
};
