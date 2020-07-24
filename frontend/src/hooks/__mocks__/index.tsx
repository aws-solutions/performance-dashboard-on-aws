/**
 * Useful mocks of our custom hook to make our unit
 * testing easier. Prevents the actual backend API
 * calls to happen and instead returns dummy data.
 */

export function useTopicAreas() {
  return {
    loading: false,
    topicareas: [
      {
        id: "123456789",
        name: "Topic Area Bananas",
      },
      {
        id: "987654321",
        name: "Topic Area Grapes",
      }
    ],
  };
}