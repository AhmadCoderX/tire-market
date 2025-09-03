import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FONTS, FONT_STYLES } from '../constants/fonts';

interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    from: string;
    to: string;
  };
}

interface BusinessHoursDisplayProps {
  businessHours: BusinessHours | string | null;
}

const BusinessHoursDisplay: React.FC<BusinessHoursDisplayProps> = ({ businessHours }) => {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  // Parse business hours - handle both string and object formats
  const parseBusinessHours = (hours: BusinessHours | string | null): BusinessHours => {
    if (!hours) return {};
    
    if (typeof hours === 'object') {
      return hours;
    }
    
    if (typeof hours === 'string') {
      try {
        return JSON.parse(hours);
      } catch (error) {
        console.error('Error parsing business hours string:', error);
        return {};
      }
    }
    
    return {};
  };

  const parsedBusinessHours = parseBusinessHours(businessHours);

  // Get today's day name
  const getToday = (): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const today = getToday();

  // Standard day order starting with Monday (matching other components)
  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Format time to ensure consistent 12-hour format
  const formatTime = (time: string): string => {
    if (!time) return 'Not Available';
    
    // If time is already in 12-hour format, return as is
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }
    
    // If time is in 24-hour format, convert to 12-hour
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    
    return time;
  };

  // Check if we have any business hours data
  const hasBusinessHours = Object.keys(parsedBusinessHours).length > 0;

  if (!hasBusinessHours) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Business hours not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hoursContainer}>
        {orderedDays.map((day) => {
          // Get the day data - try exact match first, then case variations
          const dayData = parsedBusinessHours[day] || 
                         parsedBusinessHours[day.toLowerCase()] || 
                         parsedBusinessHours[day.toUpperCase()];
          
          const isToday = day === today;
          
          let hoursText;
          let isClosed = false;
          
          if (!dayData) {
            hoursText = 'Not Available';
          } else if (dayData.isOpen === false) {
            hoursText = 'Closed';
            isClosed = true;
          } else if (dayData.isOpen === true && dayData.from && dayData.to) {
            const fromTime = formatTime(dayData.from);
            const toTime = formatTime(dayData.to);
            hoursText = `${fromTime} – ${toTime}`;
          } else {
            hoursText = 'Not Available';
          }
          
          return (
            <View 
              key={day} 
              style={[
                styles.dayRow,
                isToday && styles.todayRow,
                isMobile && { flexDirection: 'column', alignItems: 'flex-start' }
              ]}
            >
              <Text style={[
                styles.dayText,
                isToday && styles.todayText
              ]}>
                {day}
              </Text>
              <Text style={[
                styles.hoursText,
                isClosed && styles.closedText,
                isToday && styles.todayText,
                isMobile && { marginTop: 4, marginLeft: 8 }
              ]}>
                {hoursText}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    width: '100%',
    backgroundColor: '#F5F8F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#F5F8F6',
    borderRadius: 8,
  },
  emptyText: {
    ...FONT_STYLES.body,
    color: '#666666',
    fontStyle: 'italic',
  },
  hoursContainer: {
    width: '100%',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEEEC',
    borderRadius: 4,
  },
  todayRow: {
    backgroundColor: '#EBEEEC',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#5B7560',
    marginVertical: 2,
  },
  dayText: {
    ...FONT_STYLES.body,
    fontWeight: '500',
    color: '#344E41',
  },
  hoursText: {
    ...FONT_STYLES.body,
    color: '#344E41',
  },
  todayText: {
    fontWeight: '600',
    color: '#3A593F',
  },
  closedText: {
    color: '#EF4444',
    fontStyle: 'italic',
  },
});

export default BusinessHoursDisplay; 