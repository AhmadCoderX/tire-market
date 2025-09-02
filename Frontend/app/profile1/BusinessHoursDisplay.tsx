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
  businessHours: string;
}

const BusinessHoursDisplay: React.FC<BusinessHoursDisplayProps> = ({ businessHours }) => {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  // Parse business hours string
  const parseBusinessHours = (hoursString: string): BusinessHours => {
    try {
      return JSON.parse(hoursString);
    } catch (error) {
      console.error('Error parsing business hours:', error);
      return {};
    }
  };

  const parsedBusinessHours = parseBusinessHours(businessHours);

  // Get today's day name
  const getToday = (): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const today = getToday();

  // Order days starting from Monday
  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Format time to ensure consistent 12-hour format
  const formatTime = (time: string): string => {
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

  if (!businessHours || businessHours === '{}' || businessHours === 'null') {
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
          // Try both lowercase and title case versions of the day name
          const dayData = parsedBusinessHours[day] || parsedBusinessHours[day.toLowerCase()];
          const isToday = day === today;
          
          let hoursText;
          if (!dayData) {
            hoursText = 'Not Available';
          } else if (!dayData.isOpen) {
            hoursText = 'Closed';
          } else {
            const fromTime = formatTime(dayData.from);
            const toTime = formatTime(dayData.to);
            hoursText = `${fromTime} – ${toTime}`;
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
                !dayData?.isOpen && styles.closedText,
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