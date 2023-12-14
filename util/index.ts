export default {
  sleep(seconds: number) {
    return new Promise((resolve: any) => setTimeout(resolve, seconds * 1000));
  },
};
