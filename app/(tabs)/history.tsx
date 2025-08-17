import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Clock, Trash2, Search, Brain } from 'lucide-react-native';

interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
  mode: 'webcam' | 'scanner';
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'webcam' | 'scanner'>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockHistory: HistoryItem[] = [
      {
        id: '1',
        question: 'What is the capital of France?',
        answer: 'The capital of France is Paris. It\'s located in the north-central part of the country and is known for landmarks like the Eiffel Tower and Louvre Museum.',
        timestamp: Date.now() - 3600000,
        mode: 'scanner'
      },
      {
        id: '2',
        question: 'How do you calculate compound interest?',
        answer: 'Compound interest is calculated using A = P(1 + r/n)^(nt), where A is final amount, P is principal, r is annual interest rate, n is compounding frequency, and t is time in years.',
        timestamp: Date.now() - 7200000,
        mode: 'scanner'
      },
      {
        id: '3',
        question: 'What is the difference between React and Vue?',
        answer: 'React is a library focused on UI components with a larger ecosystem, while Vue is a progressive framework with built-in features like routing and state management, offering a gentler learning curve.',
        timestamp: Date.now() - 10800000,
        mode: 'scanner'
      }
    ];
    setHistory(mockHistory);
  }, []);

  const filteredHistory = history.filter(item => 
    filter === 'all' || item.mode === filter
  );

  const deleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistory(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const clearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all history items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setHistory([])
        }
      ]
    );
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Brain size={16} color="#3B82F6" />
          <Text style={styles.modeText}>{item.mode.toUpperCase()}</Text>
        </View>
        <View style={styles.itemActions}>
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
          <TouchableOpacity onPress={() => deleteItem(item.id)}>
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.questionText}>{item.question}</Text>
      <Text style={styles.answerText} numberOfLines={3}>
        {item.answer}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(['all', 'webcam', 'scanner'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[
              styles.filterButtonText,
              filter === filterType && styles.filterButtonTextActive
            ]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Search size={48} color="#6B7280" />
          <Text style={styles.emptyText}>
            {filter === 'all' 
              ? 'No history items yet'
              : `No ${filter} history items yet`
            }
          </Text>
          <Text style={styles.emptySubtext}>
            Questions and answers will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  clearButton: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  historyItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeText: {
    color: '#6B7280',
    fontSize: 12,
  },
  questionText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answerText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
});