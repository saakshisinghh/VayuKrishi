"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Thermometer, Droplets, CloudRain, Wind } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeatherImpact } from "../types/outbreak.types";

const spreadRiskColor = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

interface WeatherImpactCardProps {
  weather: WeatherImpact;
}

export function WeatherImpactCard({ weather }: WeatherImpactCardProps) {
  const t = useTranslations("diseaseDetection");
  const { current, forecast, diseaseSpreadRisk } = weather;

  const chartData = forecast.map((f) => ({
    date: new Date(f.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    humidity: f.humidity,
    rainfall: f.rainfall,
    risk: f.spreadRisk,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CloudRain className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base">{t("weather.title")}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-5">
        {/* Current conditions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Thermometer, label: "weather.temperature", value: `${current.temperature}°C`, color: "text-orange-500" },
            { icon: Droplets, label: "weather.humidity", value: `${current.humidity}%`, color: "text-blue-500" },
            { icon: CloudRain, label: "weather.rainfall", value: `${current.rainfall}mm`, color: "text-indigo-500" },
            { icon: Wind, label: "weather.windSpeed", value: `${current.windSpeed}km/h`, color: "text-gray-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex flex-col items-center rounded-xl border bg-muted/30 p-3 text-center">
              <Icon className={`mb-1 h-5 w-5 ${color}`} />
              <p className="text-lg font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground">{t(label)}</p>
            </div>
          ))}
        </div>

        {/* Overall spread risk */}
        <div
          className="flex items-center justify-between rounded-xl border p-4"
          style={{
            borderColor: spreadRiskColor[diseaseSpreadRisk.overall === "critical" ? "high" : diseaseSpreadRisk.overall] + "40",
            backgroundColor: spreadRiskColor[diseaseSpreadRisk.overall === "critical" ? "high" : diseaseSpreadRisk.overall] + "10",
          }}
        >
          <div>
            <p className="text-sm font-semibold">{t("weather.spreadRisk")}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{diseaseSpreadRisk.recommendation}</p>
          </div>
          <Badge
            className="text-sm"
            style={{
              backgroundColor: spreadRiskColor[diseaseSpreadRisk.overall === "critical" ? "high" : diseaseSpreadRisk.overall] + "20",
              color: spreadRiskColor[diseaseSpreadRisk.overall === "critical" ? "high" : diseaseSpreadRisk.overall],
            }}
          >
            {diseaseSpreadRisk.score}/100
          </Badge>
        </div>

        {/* Forecast chart */}
        <div>
          <p className="mb-3 text-sm font-semibold">{t("weather.forecast7Day")}</p>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}${name === "humidity" ? "%" : "mm"}`,
                    t(`weather.${name}`),
                  ]}
                />
                <Bar dataKey="humidity" name="humidity" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={spreadRiskColor[entry.risk] ?? "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-center text-[10px] text-muted-foreground">
            {t("weather.humidityChart")} · {t("weather.colorIndicatesRisk")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
