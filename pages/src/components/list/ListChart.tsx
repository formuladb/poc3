import React, { ReactText, useMemo } from 'react';
import {
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Line,
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell,
    PieProps,
} from 'recharts';
import { Record } from 'react-admin';
import { CListChartProps } from '../../core/entity/page';
import { entries, groupBy } from 'lodash';

interface ListChartProps extends CListChartProps {
    ids: ReactText[];
    data: { [id: string]: Record };
    resource: string;
    children: null | React.ReactNode;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ListChart = (props: ListChartProps) => {
    const {
        data,
        chartType,
        xAxisSource,
        yAxisSource,
        pivotYAxisSource,
        yAxisSource2,
        yAxisSource3,
        yAxisSource4
    } = props;

    const { yKey, yKey2, yKey3, yKey4, chartData } = useMemo(() => {
        if (pivotYAxisSource) {
            const groupedData = groupBy(data, xAxisSource);
            const pivotValues = new Set<string>();
            const chartData: ({ name: string } & object)[] = [];
            entries(groupedData).forEach(([k, recs]) => {
                let ret = { name: k };
                for (let r of recs) {
                    pivotValues.add(r[pivotYAxisSource]);
                    ret[r[pivotYAxisSource]] = r[yAxisSource];
                }
                chartData.push(ret);
            });
            const yKeys = Array.from(pivotValues).sort();
            const yKey = yKeys[0] || yAxisSource, yKey2 = yKeys[1], yKey3 = yKeys[2], yKey4 = yKeys[3];
            return { yKey, yKey2, yKey3, yKey4, chartData };
        } else {
            const yKey = yAxisSource, yKey2 = yAxisSource2, yKey3 = yAxisSource3, yKey4 = yAxisSource4;
            const chartData = Object.values(data).map(r => {
                let ret = {
                    name: r[xAxisSource],
                    [yAxisSource]: r[yAxisSource],
                };
                if (yAxisSource2) ret[yAxisSource2] = r[yAxisSource2];
                if (yAxisSource3) ret[yAxisSource3] = r[yAxisSource3];
                if (yAxisSource4) ret[yAxisSource4] = r[yAxisSource4];
                return ret;
            });

            return { yKey, yKey2, yKey3, yKey4, chartData };
        }
    }, [data, xAxisSource, yAxisSource, pivotYAxisSource, yAxisSource2, yAxisSource3, yAxisSource4,]);

    return (<div style={{ width: "65vw", height: "35vh" }}>
        {"Line" == chartType && <ResponsiveContainer key="Line" width="100%" height="100%">
            <LineChart width={500} height={300} data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
                {yKey2 && <Line type="monotone" dataKey={yKey2} stroke="#82ca9d" />}
                {yKey3 && <Line type="monotone" dataKey={yKey3} stroke="#e458e9" />}
                {yKey4 && <Line type="monotone" dataKey={yKey4} stroke="#ec2121" />}
                <Tooltip key={xAxisSource} />
                <Legend />
            </LineChart>
        </ResponsiveContainer>}
        {"Pie" == chartType &&
            <ResponsiveContainer key="Pie" width="100%" height="100%">
                <PieChart width={400} height={400}>
                    {[yKey, yKey2, yKey3, yKey4].map(yK =>
                        yK && <Pie key={yK} dataKey={yK} isAnimationActive={true} data={chartData}
                            cx="50%" cy="50%" outerRadius={80} label
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    )}
                    <Tooltip key={xAxisSource} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>}
    </div>);
};
