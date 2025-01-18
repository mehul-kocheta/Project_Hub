import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1a1f2b', color: '#fff', padding: '20px 0' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ color: '#4a8cff' }}>
                Contact Us
              </Typography>
              <Box>
                <Typography variant="body1">
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: '#4a8cff' }} />{' '}
                  <Link
                    href="mailto:contact@projecthub.ac.in"
                    underline="hover"
                    sx={{ 
                      color: '#fff',
                      '&:hover': {
                        color: '#4a8cff'
                      }
                    }}
                  >
                    contact@projecthub.ac.in
                  </Link>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: '10px' }}>
                  <FontAwesomeIcon icon={faPhone} style={{ color: '#4a8cff' }} />{' '}
                  <Link
                    href="tel:+916301124363"
                    underline="hover"
                    sx={{ 
                      color: '#fff',
                      '&:hover': {
                        color: '#4a8cff'
                      }
                    }}
                  >
                    +91 0000000
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end">
            <Box>
              <Typography variant="h5" gutterBottom sx={{ color: '#4a8cff' }}>
                Follow Us
              </Typography>
              <Box>
                <IconButton
                  href="/"
                  sx={{ 
                    color: '#fff',
                    '&:hover': {
                      color: '#4a8cff'
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
                </IconButton>
                <IconButton
                  href="/"
                  sx={{ 
                    color: '#fff',
                    marginLeft: '10px',
                    '&:hover': {
                      color: '#4a8cff'
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faLinkedin} size="2x" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" sx={{ color: '#8b92a8' }}>
            &copy; 2025 Project Hub. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
