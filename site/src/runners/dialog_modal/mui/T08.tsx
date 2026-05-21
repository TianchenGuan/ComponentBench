'use client';

/**
 * dialog_modal-mui-T08: Scroll a long dialog and accept at the bottom
 *
 * Layout: isolated_card centered, DARK theme. A Material UI Dialog is open on page load.
 *
 * Dialog configuration:
 * - Title: "Terms of service"
 * - scroll="paper" so the dialog content area is internally scrollable.
 * - Content: long terms text (~4 screens) with "I agree" button at the bottom.
 * - No actions row is pinned.
 *
 * Initial state: dialog open, scrolled to the top.
 * Success: The 'Terms of service' dialog is closed via 'I agree' button (close_reason='agree_button').
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Dialog starts open
  const [status, setStatus] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Terms of service',
    };
  }, []);

  const handleAgree = () => {
    setOpen(false);
    setStatus('Accepted');
    window.__cbModalState = {
      open: false,
      close_reason: 'agree_button',
      modal_instance: 'Terms of service',
    };
    
    // Success when closed via I agree button
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleClose = (event: object, reason: string) => {
    if (reason === 'backdropClick') {
      setOpen(false);
      setStatus('Backdrop');
      window.__cbModalState = {
        open: false,
        close_reason: 'mask_click',
        modal_instance: 'Terms of service',
      };
    } else if (reason === 'escapeKeyDown') {
      setOpen(false);
      setStatus('Escape');
      window.__cbModalState = {
        open: false,
        close_reason: 'escape_key',
        modal_instance: 'Terms of service',
      };
    }
  };

  const termsContent = `
    TERMS OF SERVICE

    Last updated: January 2025

    1. ACCEPTANCE OF TERMS
    By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using this service, you shall be subject to any posted guidelines or rules applicable to such services.

    2. DESCRIPTION OF SERVICE
    Our service provides users with access to a rich collection of resources, including various communications tools, forums, shopping services, personalized content, and branded programming through its network of properties.

    3. REGISTRATION OBLIGATIONS
    In consideration of your use of the Service, you agree to: (a) provide true, accurate, current, and complete information about yourself as prompted by the Service's registration form, and (b) maintain and promptly update the Registration Data to keep it true, accurate, current, and complete.

    4. PRIVACY POLICY
    Registration Data and certain other information about you are subject to our applicable Privacy Policy. You understand that through your use of the Service you consent to the collection and use of this information.

    5. MEMBER ACCOUNT, PASSWORD AND SECURITY
    You will receive a password and account designation upon completing the Service's registration process. You are responsible for maintaining the confidentiality of the password and account.

    6. CONTENT
    You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages, tags, or other materials ("Content") are the sole responsibility of the person from whom such Content originated.

    7. GENERAL PRACTICES REGARDING USE AND STORAGE
    You acknowledge that the Service may establish general practices and limits concerning use of the Service, including without limitation the maximum period of time that data or other content will be retained by the Service.

    8. MODIFICATIONS TO SERVICE
    The Service reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.

    9. TERMINATION
    You agree that the Service may, under certain circumstances and without prior notice, immediately terminate your account, any associated email address, and access to the Service.

    10. DEALINGS WITH ADVERTISERS
    Your correspondence or business dealings with, or participation in promotions of, advertisers found on or through the Service are solely between you and such advertiser.

    11. LINKS
    The Service may provide, or third parties may provide, links to other World Wide Web sites or resources. The Service does not endorse and is not responsible for the content of external sites.

    12. INDEMNITY
    You agree to indemnify and hold the Service and its subsidiaries, affiliates, officers, agents, employees, partners, and licensors harmless from any claim or demand.

    13. NO RESALE OF SERVICE
    You agree not to reproduce, duplicate, copy, sell, trade, resell, or exploit for any commercial purposes, any portion of the Service.

    14. GENERAL INFORMATION
    The Terms of Service constitute the entire agreement between you and the Service. The failure of the Service to exercise or enforce any right shall not constitute a waiver of such right.
  `;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%', p: 2 }}>
        <Card sx={{ width: 400 }}>
          <CardHeader title="Account Setup" />
          <CardContent>
            <Typography variant="body2">
              Please review and accept the terms of service.
            </Typography>
          </CardContent>
        </Card>

        {status && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {status}
          </Typography>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          scroll="paper"
          maxWidth="sm"
          fullWidth
          aria-labelledby="terms-dialog-title"
          data-testid="dialog-terms-of-service"
        >
          <DialogTitle id="terms-dialog-title">Terms of service</DialogTitle>
          <DialogContent dividers>
            <Typography
              variant="body2"
              sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 11 }}
            >
              {termsContent}
            </Typography>
            
            <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid rgba(255,255,255,0.12)', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleAgree}
                data-testid="cb-agree"
              >
                I agree
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
