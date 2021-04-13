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
} from 'recharts';
import { Record } from 'react-admin';
import { CListChartProps } from '../../core-domain/page';
import { entries, groupBy } from 'lodash';

interface ListChartProps extends CListChartProps {
    ids: ReactText[];
    data: { [id: string]: Record };
    resource: string;
    children: null | React.ReactNode;
}

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
            const chartData: ({ name: string } & object )[] = [];
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
    console.log('XXX', data, chartData);

    return (<div style={{ width: "65vw", height: "35vh" }}>
        {"Line" == chartType && <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
                {yKey2 && <Line type="monotone" dataKey={yKey2} stroke="#82ca9d" />}
                {yKey3 && <Line type="monotone" dataKey={yKey3} stroke="#e458e9" />}
                {yKey4 && <Line type="monotone" dataKey={yKey4} stroke="#ec2121" />}
            </LineChart>
        </ResponsiveContainer>}
        {"Pie" == chartType &&
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie dataKey={yKey} isAnimationActive={true} data={chartData}
                        cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label
                    />
                    {yKey2 && <Pie dataKey={yKey2} isAnimationActive={false} data={chartData}
                        cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label
                    />}
                    {yKey3 && <Pie dataKey={yKey3} isAnimationActive={false} data={chartData}
                        cx="50%" cy="50%" outerRadius={80} fill="#e458e9" label
                    />}
                    {yKey4 && <Pie dataKey={yKey4} isAnimationActive={false} data={chartData}
                        cx="50%" cy="50%" outerRadius={80} fill="#ec2121" label
                    />}
                    <Tooltip key={xAxisSource} />
                </PieChart>
            </ResponsiveContainer>}
    </div>);
};
