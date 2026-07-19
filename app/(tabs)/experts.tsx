/**
 * Expert directory tab – placeholder for Phase 1, full implementation in Phase 2.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Surface } from '../../constants/theme';

export default function ExpertsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <EmptyState
        icon="people-outline"
        title="Danh sách chuyên gia"
        description="Tính năng tìm kiếm và đặt lịch chuyên gia sẽ sớm được ra mắt."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Surface.canvas,
  },
});
