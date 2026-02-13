/**
 * Scanner Page
 * QR Code and Barcode scanner using device camera
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScanner from 'react-qr-barcode-scanner';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack,
  QrCodeScanner,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Refresh,
} from '@mui/icons-material';
import { submitScan } from '../services/scanner.service';

type ScanState = 'scanning' | 'processing' | 'success' | 'duplicate' | 'error';

interface ScanResult {
  data: string;
  message: string;
}

const Scanner = () => {
  const navigate = useNavigate();
  
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [stopStream, setStopStream] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleBack = () => {
    setStopStream(true);
    setTimeout(() => navigate('/'), 100);
  };

  const handleScanUpdate = useCallback(
    async (_err: unknown, result: { getText: () => string } | undefined) => {
      // Skip if not in scanning state or already processing
      if (scanState !== 'scanning') return;

      if (result) {
        const scannedData = result.getText();
        
        // Stop the camera and process the result
        setStopStream(true);
        setScanState('processing');

        try {
          const response = await submitScan(scannedData);

          if (response.success) {
            setScanState('success');
            setScanResult({
              data: scannedData,
              message: response.message || 'Scan submitted successfully!',
            });
          } else if (response.duplicate) {
            setScanState('duplicate');
            setScanResult({
              data: scannedData,
              message: response.message || 'This code has already been scanned',
            });
          } else {
            setScanState('error');
            setScanResult({
              data: scannedData,
              message: response.error || 'Failed to submit scan',
            });
          }
        } catch (error) {
          setScanState('error');
          setScanResult({
            data: scannedData,
            message: 'An unexpected error occurred',
          });
        }

        setSnackbarOpen(true);
      }
    },
    [scanState]
  );

  const handleCameraError = (error: string | DOMException) => {
    console.error('Camera error:', error);
    if (typeof error === 'object' && error.name === 'NotAllowedError') {
      setCameraError(
        'Camera access denied. Please allow camera access in your browser settings.'
      );
    } else if (typeof error === 'object' && error.name === 'NotFoundError') {
      setCameraError('No camera found on this device.');
    } else {
      setCameraError('Failed to access camera. Please try again.');
    }
  };

  const handleScanAnother = () => {
    setScanState('scanning');
    setScanResult(null);
    setStopStream(false);
    setCameraError(null);
  };

  const getStatusIcon = () => {
    switch (scanState) {
      case 'success':
        return <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />;
      case 'duplicate':
        return <Warning sx={{ fontSize: 64, color: 'warning.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (scanState) {
      case 'success':
        return 'success';
      case 'duplicate':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#000' }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <QrCodeScanner sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scan QR Code
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Scanner Content */}
      <Container maxWidth="sm" sx={{ pt: 2, pb: 4 }}>
        {/* Camera Error */}
        {cameraError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {cameraError}
            <Button
              size="small"
              onClick={handleScanAnother}
              sx={{ ml: 2 }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {/* Scanner View */}
        {scanState === 'scanning' && !cameraError && (
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                backgroundColor: '#000',
              }}
            >
              <BarcodeScanner
                width="100%"
                height="100%"
                onUpdate={handleScanUpdate}
                onError={handleCameraError}
                stopStream={stopStream}
                facingMode="environment"
              />
              {/* Scanning overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '70%',
                  height: '70%',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: 2,
                  pointerEvents: 'none',
                }}
              />
            </Box>
            <CardContent>
              <Typography variant="body1" align="center" color="text.secondary">
                Position the QR code within the frame
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Processing View */}
        {scanState === 'processing' && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress size={64} sx={{ mb: 3 }} />
              <Typography variant="h6">Processing scan...</Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we verify your scan
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Result View */}
        {(scanState === 'success' ||
          scanState === 'duplicate' ||
          scanState === 'error') &&
          scanResult && (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                {getStatusIcon()}
                
                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                  {scanState === 'success' && 'Scan Successful!'}
                  {scanState === 'duplicate' && 'Duplicate Detected'}
                  {scanState === 'error' && 'Scan Failed'}
                </Typography>

                <Alert severity={getStatusColor()} sx={{ my: 2, textAlign: 'left' }}>
                  {scanResult.message}
                </Alert>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                  }}
                >
                  Scanned: {scanResult.data}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={handleScanAnother}
                  >
                    Scan Another
                  </Button>
                  <Button variant="outlined" onClick={handleBack}>
                    Back to Home
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
      </Container>

      {/* Snackbar for quick feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={getStatusColor()}
          sx={{ width: '100%' }}
        >
          {scanResult?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Scanner;
