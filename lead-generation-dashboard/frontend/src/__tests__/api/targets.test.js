import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { targetAPI } from '../../services/api';
import { format } from 'date-fns';

const mock = new MockAdapter(axios);

describe('Target API', () => {
    beforeEach(() => {
        mock.reset();
    });

    describe('getEmployeeTargets', () => {
        const userId = '123';
        const params = {
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'),
            type: 'daily',
        };

        it('should fetch employee targets successfully', async () => {
            const response = {
                targets: [
                    {
                        _id: '1',
                        userId: '123',
                        date: new Date().toISOString(),
                        targets: {
                            jobsFetched: 20,
                            jobsApplied: 10,
                        },
                        achievements: {
                            jobsFetched: 15,
                            jobsApplied: 8,
                        },
                    },
                ],
            };

            mock.onGet(`/api/targets/employee/${userId}`).reply(200, response);

            const result = await targetAPI.getEmployeeTargets(userId, params);
            expect(result.data).toEqual(response);
        });

        it('should handle unauthorized access', async () => {
            mock.onGet(`/api/targets/employee/${userId}`).reply(403, {
                message: 'Unauthorized access',
            });

            await expect(targetAPI.getEmployeeTargets(userId, params))
                .rejects.toThrow('Unauthorized access');
        });
    });

    describe('updateAchievements', () => {
        const targetId = '1';
        const updateData = {
            achievements: {
                jobsFetched: 15,
                jobsApplied: 8,
            },
            profileWiseData: [
                {
                    profileId: '1',
                    jobsFetched: 8,
                    jobsApplied: 4,
                },
                {
                    profileId: '2',
                    jobsFetched: 7,
                    jobsApplied: 4,
                },
            ],
        };

        it('should update achievements successfully', async () => {
            const response = {
                _id: '1',
                achievements: updateData.achievements,
                profileWiseData: updateData.profileWiseData,
            };

            mock.onPut(`/api/targets/${targetId}/achievements`).reply(200, response);

            const result = await targetAPI.updateAchievements(targetId, updateData);
            expect(result.data).toEqual(response);
        });

        it('should validate achievement data', async () => {
            const invalidData = {
                achievements: {
                    jobsFetched: -1,
                    jobsApplied: 8,
                },
            };

            mock.onPut(`/api/targets/${targetId}/achievements`).reply(400, {
                message: 'Invalid achievement data',
            });

            await expect(targetAPI.updateAchievements(targetId, invalidData))
                .rejects.toThrow('Invalid achievement data');
        });
    });

    describe('getStats', () => {
        const params = {
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'),
            userId: '123',
            type: 'daily',
        };

        it('should fetch stats successfully', async () => {
            const response = {
                dailyStats: [
                    {
                        date: new Date().toISOString(),
                        jobsFetched: 15,
                        jobsApplied: 8,
                        achievementPercentage: 75,
                    },
                ],
                totalStats: {
                    jobsFetched: 150,
                    jobsApplied: 80,
                    achievementPercentage: 80,
                },
            };

            mock.onGet('/api/targets/stats').reply(200, response);

            const result = await targetAPI.getStats(params);
            expect(result.data).toEqual(response);
        });

        it('should handle invalid date range', async () => {
            const invalidParams = {
                ...params,
                startDate: format(new Date(), 'yyyy-MM-dd'),
                endDate: format(new Date('2024-01-01'), 'yyyy-MM-dd'),
            };

            mock.onGet('/api/targets/stats').reply(400, {
                message: 'Invalid date range',
            });

            await expect(targetAPI.getStats(invalidParams))
                .rejects.toThrow('Invalid date range');
        });
    });
});
