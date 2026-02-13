/**
 * Home Page
 * Main dashboard with scan button
 */

import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  QrCodeScanner,
  Logout,
  CameraAlt,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleScan = () => {
    navigate('/scan');
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <QrCodeScanner sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QR Scanner
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* Welcome Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Welcome, {user?.username}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Use this app to scan QR codes and barcodes. Your scans will be
              recorded and checked for duplicates.
            </Typography>
          </CardContent>
        </Card>

        {/* Scan Button Card */}
        <Card
          sx={{
            textAlign: 'center',
            py: 4,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            },
          }}
          onClick={handleScan}
        >
          <CardContent>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CameraAlt sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              Scan QR Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tap to open the camera and scan a QR code or barcode
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<QrCodeScanner />}
              onClick={handleScan}
            >
              Start Scanning
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              How it works
            </Typography>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Click "Start Scanning" to open your camera
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Point your camera at a QR code or barcode
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                The code will be automatically detected and processed
              </Typography>
              <Typography component="li" variant="body2">
                You'll see a success message or duplicate warning
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;
