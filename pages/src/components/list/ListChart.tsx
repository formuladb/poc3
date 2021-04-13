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
        yAxisSource2,
        yAxisSource3,
        yAxisSource4
    } = props;

    const chartData = useMemo(() => {
        return Object.values(data);
    }, [data]);
    return (<>
        {"Line" == chartType && <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={chartData}>
                <XAxis dataKey={xAxisSource} />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey={yAxisSource} stroke="#8884d8" />
                {yAxisSource2 && <Line type="monotone" dataKey={yAxisSource2} stroke="#82ca9d" />}
                {yAxisSource3 && <Line type="monotone" dataKey={yAxisSource3} stroke="#e458e9" />}
                {yAxisSource4 && <Line type="monotone" dataKey={yAxisSource4} stroke="#ec2121" />}
            </LineChart>
        </ResponsiveContainer>}
        {
            "Pie" == chartType &&
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie dataKey={yAxisSource} isAnimationActive={false} data={chartData}
                        cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label
                    />
                    {yAxisSource2 && <Pie dataKey={yAxisSource} isAnimationActive={false} data={chartData}
                        cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label
                    />}
                    {yAxisSource2 && <Pie dataKey={yAxisSource} isAnimationActive={false} data={chartData}
                        cx="50%" cy="50%" outerRadius={80} fill="#e458e9" label
                    />}
                    {yAxisSource2 && <Pie dataKey={yAxisSource} isAnimationActive={false} data={chartData}
                        cx="50%" cy="50%" outerRadius={80} fill="#ec2121" label
                    />}
                </PieChart>
            </ResponsiveContainer>
        }
    </>);
};
