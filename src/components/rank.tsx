"use client"

import React from "react"

const styles = {
  container: {
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '32px',
    width: '400px'
  },
  rankContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    gap: '24px'
  },
  rankBox: {
    flex: 1,
    textAlign: 'center' as const,
    color: '#FFFFFF'
  },
  rankNumber: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  rankLabel: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Courier, monospace'
  }
}

export function Rank() {
  return (
    <div style={styles.container}>
      <div style={styles.rankContainer}>
        <div style={styles.rankBox}>
          <div style={styles.rankNumber}>2nd</div>
          <div style={styles.rankLabel}>% Profit</div>
        </div>
        <div style={styles.rankBox}>
          <div style={styles.rankNumber}>2nd</div>
          <div style={styles.rankLabel}>Total Return</div>
        </div>
      </div>
    </div>
  )
}
