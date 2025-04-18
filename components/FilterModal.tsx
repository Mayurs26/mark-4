import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Switch
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import Button from './Button';
import { X, Filter } from 'lucide-react-native';

export interface FilterOptions {
  userTypes: {
    individuals: boolean;
    groups: boolean;
  };
  subjects: string[];
  selectedSubjects: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  options: FilterOptions;
  onApplyFilters: (options: FilterOptions) => void;
}

export default function FilterModal({ 
  visible, 
  onClose, 
  options, 
  onApplyFilters 
}: FilterModalProps) {
  const { theme } = useThemeStore();
  const themeColors = colors[theme];
  
  const [localOptions, setLocalOptions] = useState<FilterOptions>({...options});
  
  const handleToggleUserType = (type: 'individuals' | 'groups') => {
    setLocalOptions(prev => ({
      ...prev,
      userTypes: {
        ...prev.userTypes,
        [type]: !prev.userTypes[type]
      }
    }));
  };
  
  const handleToggleSubject = (subject: string) => {
    setLocalOptions(prev => {
      const isSelected = prev.selectedSubjects.includes(subject);
      
      return {
        ...prev,
        selectedSubjects: isSelected
          ? prev.selectedSubjects.filter(s => s !== subject)
          : [...prev.selectedSubjects, subject]
      };
    });
  };
  
  const handleApply = () => {
    onApplyFilters(localOptions);
    onClose();
  };
  
  const handleReset = () => {
    setLocalOptions({
      userTypes: {
        individuals: true,
        groups: true,
      },
      subjects: options.subjects,
      selectedSubjects: [],
    });
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              Filters
            </Text>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                User Type
              </Text>
              
              <View style={[styles.optionRow, { borderBottomColor: themeColors.border }]}>
                <Text style={[styles.optionText, { color: themeColors.text }]}>
                  Individuals
                </Text>
                <Switch
                  value={localOptions.userTypes.individuals}
                  onValueChange={() => handleToggleUserType('individuals')}
                  trackColor={{ false: '#767577', true: themeColors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={[styles.optionRow, { borderBottomColor: themeColors.border }]}>
                <Text style={[styles.optionText, { color: themeColors.text }]}>
                  Groups
                </Text>
                <Switch
                  value={localOptions.userTypes.groups}
                  onValueChange={() => handleToggleUserType('groups')}
                  trackColor={{ false: '#767577', true: themeColors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Subjects
              </Text>
              
              <View style={styles.subjectsContainer}>
                {localOptions.subjects.map((subject, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.subjectTag,
                      localOptions.selectedSubjects.includes(subject)
                        ? { backgroundColor: themeColors.primary }
                        : { 
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: themeColors.border
                          }
                    ]}
                    onPress={() => handleToggleSubject(subject)}
                  >
                    <Text
                      style={[
                        styles.subjectText,
                        { 
                          color: localOptions.selectedSubjects.includes(subject)
                            ? '#FFFFFF'
                            : themeColors.text
                        }
                      ]}
                    >
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <Button
              title="Reset"
              onPress={handleReset}
              variant="outline"
              style={styles.resetButton}
            />
            
            <Button
              title="Apply Filters"
              onPress={handleApply}
              icon={<Filter size={18} color="#FFFFFF" />}
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});