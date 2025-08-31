import React from 'react';
import { View, Text, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';

interface BusinessHoursDisplayProps {
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      from: string;
      to: string;
    };
  } | string | null;
}

const BusinessHoursDisplay: React.FC<BusinessHoursDisplayProps> = ({ businessHours }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  // Get the current day of the week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  
  // Reorder days to start with Monday
  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Parse business hours if they're provided as a string
  const parseBusinessHours = () => {
    if (!businessHours) return null;
    
    // If it's already an object, return it
    if (typeof businessHours !== 'string') return businessHours;
    
    try {
      // Try to parse the string as JSON
      return JSON.parse(businessHours);
    } catch (error) {
      console.error('Error parsing business hours string:', error);
      
      // If parsing fails, try to extract info from the formatted string
      const parsedHours: {[key: string]: {isOpen: boolean, from: string, to: string}} = {};
      const lines = businessHours.split('\n');
      
      for (const line of lines) {
        // Example format: "Monday: 9:00 AM - 5:00 PM"
        const match = line.match(/^(.*?):\s*(.*?)$/);
        if (match) {
          const [_, day, hours] = match;
          
          if (hours.toLowerCase().includes('closed')) {
            parsedHours[day] = { isOpen: false, from: '', to: '' };
          } else if (hours.toLowerCase().includes('not available')) {
            // Skip this day as we don't have data
          } else {
            const timeParts = hours.split('-').map(part => part.trim());
            if (timeParts.length === 2) {
              parsedHours[day] = { isOpen: true, from: timeParts[0], to: timeParts[1] };
            }
          }
        }
      }
      
      return Object.keys(parsedHours).length > 0 ? parsedHours : null;
    }
  };
  
  const parsedBusinessHours = parseBusinessHours();
  
  if (!parsedBusinessHours) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No business hours provided
        </Text>
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
            hoursText = `${dayData.from} – ${dayData.to}`;
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
    fontSize: 15,
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
    fontSize: 15,
    fontWeight: '500',
    color: '#344E41',
  },
  hoursText: {
    fontSize: 15,
    color: '#344E41',
  },
  todayText: {
    fontWeight: '600',
    color: '#3A593F',
  },
  closedText: {
    color: '#B32F22',
  },
});

export default BusinessHoursDisplay; 