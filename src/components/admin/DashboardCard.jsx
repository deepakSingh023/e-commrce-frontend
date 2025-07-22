import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const DashboardCard = ({ title, value, children, icon }) => {
  return (
    <Card className="dashboard-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </div>
          {icon && (
            <Box 
              sx={{ 
                bgcolor: 'primary.light', 
                borderRadius: '50%', 
                width: 56, 
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        {children && <Box mt={2}>{children}</Box>}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;