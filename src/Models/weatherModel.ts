import { DataTypes, Model } from "sequelize";
import sequelize from "../dbConfig/pgConfig";

// define interface for weather attributes
interface weatherAttributes {
  id?: number;
  city: string;
  country: string;
  weather: string;
  time: Date;
  longitude: number;
  latitude: number;
}

// define a class that extends the sequelize model and implements the weatherAttributes interface
class Weather extends Model<weatherAttributes> implements weatherAttributes {
  public id!: number;
  public city!: string;
  public country!: string;
  public weather!: string;
  public time!: Date;
  public longitude!: number;
  public latitude!: number;
}

// defined weather model with attributes
Weather.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weather: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "weathers",
    timestamps: false,
  }
);

// export the weather model
export { Weather };
