import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SellerPerformanceProps {
  data: {
    business: {
      total_users: number;
      average_rating: number;
    };
    individual: {
      total_users: number;
      average_rating: number;
    };
  };
}

export const SellerPerformanceChart: React.FC<SellerPerformanceProps> = ({ data }) => {
  const chartData = {
    labels: ['Business Users', 'Individual Users'],
    datasets: [
      {
        data: [data.business.total_users, data.individual.total_users],
        backgroundColor: ['#D97706', '#16A34A'],
        borderColor: ['#B45309', '#15803D'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 14,
            family: 'Arial',
          },
          color: '#1E293B',
          padding: 20,
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Seller Type Distribution',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: 'Arial',
        },
        color: '#1E293B',
        padding: {
          bottom: 10,
        },
      },
      tooltip: {
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        backgroundColor: 'rgba(30, 41, 59, 0.85)',
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = data.business.total_users + data.individual.total_users;
            const percentage = ((value / total) * 100).toFixed(1);
            const rating = label.includes('Business') 
              ? data.business.average_rating 
              : data.individual.average_rating;
            return `${label}: ${value} (${percentage}%) - Avg Rating: ${rating.toFixed(1)}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow" style={{ 
      height: '300px',
      borderRadius: '12px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
      border: '1px solid #E5E7EB',
      padding: '20px'
    }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}; 