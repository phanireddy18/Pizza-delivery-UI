// // src/types.ts
// export type RootStackParamList = {
//     InitialScreen: undefined;
//     Drawer: undefined;
//     pizzaDetails: undefined;
//     ExpenseDetailsScreen: {expenseId: number; groupId: number};
//     Charts: {
//       pieChartData: any;
//       barChartData: any;
//     };
//     Activities: undefined;
//   };

// AppNavigator.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  PizzaListScreen: undefined;
  PizzaDetails: undefined; // add any params here if needed
};
