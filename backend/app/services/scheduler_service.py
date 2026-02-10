from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.interval import IntervalTrigger
import logging

logger = logging.getLogger(__name__)


class SchedulerService:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()

    def start(self):
        if not self.scheduler.running:
            self.scheduler.start()
            logger.info("Scheduler started")

    def shutdown(self):
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Scheduler stopped")

    def add_cron_job(self, job_id: str, func, cron_expression: str, **kwargs):
        parts = cron_expression.split()
        trigger = CronTrigger(
            minute=parts[0] if len(parts) > 0 else "*",
            hour=parts[1] if len(parts) > 1 else "*",
            day=parts[2] if len(parts) > 2 else "*",
            month=parts[3] if len(parts) > 3 else "*",
            day_of_week=parts[4] if len(parts) > 4 else "*",
        )
        self.scheduler.add_job(func, trigger, id=job_id, replace_existing=True, **kwargs)

    def add_interval_job(self, job_id: str, func, seconds: int, **kwargs):
        self.scheduler.add_job(func, IntervalTrigger(seconds=seconds), id=job_id, replace_existing=True, **kwargs)

    def remove_job(self, job_id: str):
        try:
            self.scheduler.remove_job(job_id)
        except Exception:
            pass

    def get_jobs(self):
        return self.scheduler.get_jobs()


scheduler_service = SchedulerService()
