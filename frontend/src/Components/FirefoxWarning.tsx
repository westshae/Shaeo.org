import { Card, CardContent, Typography } from '@mui/material';

const isFirefox = /Firefox/i.test(navigator.userAgent);

const FirefoxWarning = () => {
  return (
    isFirefox && (
      <Card style={{ maxWidth: 400, margin: '20px auto' }}>
        <CardContent>
          <Typography variant="h6" color="error">
            Browser Warning
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            You are using Firefox. Please be aware that there might be styling issues. For the best experience, we recommend using Google Chrome.
          </Typography>
        </CardContent>
      </Card>
    )
  );
};

export default FirefoxWarning;
