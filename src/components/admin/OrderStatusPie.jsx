'use client';

import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = {
  'Pending': '#FFC107',
  'Processing': '#2196F3',
  'Shipped': '#9C27B0',
  'Delivered': '#4CAF50',
  'Cancelled': '#F44336'
};

const OrderStatusPie = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="count"
          nameKey="_id"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry._id] || '#8884d8'} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [value, 'Orders']}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px'
          }}
        />
        <Legend 
          content={() => (
            <Box display="flex" justifyContent="center" mt={2} flexWrap="wrap">
              {data.map((status) => (
                <Box 
                  key={status._id} 
                  display="flex" 
                  alignItems="center" 
                  mr={2}
                  mb={1}
                >
                  <Box 
                    width={14} 
                    height={14} 
                    bgcolor={COLORS[status._id]} 
                    mr={1} 
                    borderRadius="50%"
                  />
                  <Typography variant="body2">
                    {status._id}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OrderStatusPie;