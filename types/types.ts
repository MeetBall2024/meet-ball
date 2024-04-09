declare global {
  namespace PrismaJson {
    type TimeTable = {
      [key: string]: number[];
    };
  }
}

export {};
