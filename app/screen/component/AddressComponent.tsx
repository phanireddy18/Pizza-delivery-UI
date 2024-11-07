import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const AddressComponent = ({deliveryAddress}: any) => {
  return (
    <View style={styles.addressContainer}>
      <View style={styles.innerContainer}>
        <View>
          <TouchableOpacity style={styles.radioButtonContainer}>
            <View style={styles.radioInner}>
              <View style={[styles.radioButton, styles.radioButtonSelected]} />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.addressText}>Delivery Address:</Text>
          <Text style={styles.address}>{deliveryAddress}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  addressContainer: {
    padding: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 15,
    width: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#4caf50', // This color indicates the selected state
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioInner: {
    borderColor: '#fff',
    borderWidth: 2,
  },
});

export default AddressComponent;
