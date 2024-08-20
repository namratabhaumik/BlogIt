import React from 'react';
import { Container, Grid, Typography, Link } from '@mui/material';
import { Image } from 'react-bootstrap';
import Box from '@mui/material/Box';
import brandLogo from '../../img/logo.png';

const Footer = () => {
  return (
    <Box
      className='mt-5'
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: "#eeedf8",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction={"row"} rowSpacing={2} spacing={2}>
          <Grid item xs>
            <Image src={brandLogo} style={{ width: '30%' }} />
            <div className='pt-2'>
              <Typography variant="body1">
                BlogIt Community — A constructive and inclusive blogging social network. With you every step of your journey.
              </Typography>
            </div>
          </Grid>
          <Grid item xs>
              <Typography variant="h6"><Link href='/'>Home</Link></Typography>
            <Typography variant="h6"><Link href="/videos">Videos</Link></Typography>
            <Typography variant="h6"><Link href="/tags">Tags</Link></Typography>
            <Typography variant="h6"><Link href="/community">Community</Link></Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h6"><Link href="/faq">FAQ</Link></Typography>
            <Typography variant="h6"><Link href="/contact">Contact Us</Link></Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            Built using Netlify.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Made with love and ReactJS. BlogIt Community © 2024.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
