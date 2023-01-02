import moment from "moment";

export const getMaturityInfo = (wsd: any, wed: any) => {
  const maturityAt = moment(wed, "YYYY-MM-DD HH:mm:ss.SSSS");
  // const earlyWithdrawDate = moment(wsd, "YYYY-MM-DD HH:mm:ss.SSSS");
  var stillUtc = moment
    .utc(moment.utc(wsd).format("YYYY-MM-DD HH:mm:ss Z"))
    .toDate();
  // console.log(moment(stillUtc).local().format("YYYY-MM-DD HH:mm:ss")); // UTC to Local
  // console.log({ maturityAt, wsd });
  // maturityAt.add(1, "minutes");

  const now = moment(new Date(), "YYYY-MM-DD HH:mm:ss.SSSS");

  let toReturn = {
    maturityAt: maturityAt.format("DD MMMM YYYY HH:mm:ss"),
    minutes: 0,
    hours: 0,
    days: 0,
    months: 0,
    earlyWithdrawDate: moment(stillUtc).local().format("YYYY-MM-DD HH:mm:ss"),
  };

  if (now.isBefore(maturityAt)) {
    const months = moment.duration(maturityAt.diff(now)).asMonths();
    const days = moment.duration(maturityAt.diff(now)).asDays();
    const hours = moment.duration(maturityAt.diff(now)).asHours();
    const minutes = moment.duration(maturityAt.diff(now)).asMinutes();

    // console.log(months, days, hours, minutes % 60);

    if (minutes % 60 > 0) {
      toReturn.minutes = Math.round(minutes % 60);
    }

    if (hours % 24 > 0 && hours % 24 < 24) {
      toReturn.hours = Math.round(hours % 24);
    }

    if (days % 30 > 0 && days % 30 < 30) {
      toReturn.days = Math.round(days % 24);
    }

    toReturn.months = Math.round(months);
  }

  return toReturn;
};

export const getStakingInfo = (sed: any, ssd: any, wsd: any, wed: any) => {
  let start = moment(sed, "YYYY-MM-DD HH:mm:ss.SSSS");
  let end = moment(new Date(), "YYYY-MM-DD HH:mm:ss.SSSS");

  const months = moment.duration(start.diff(end)).asMonths();
  const days = moment.duration(start.diff(end)).asDays();
  const hours = moment.duration(start.diff(end)).asHours();
  const minutes = moment.duration(start.diff(end)).asMinutes();
  let toReturn = {
    isStakingOpen: false,
    stakingClosesIn: "",
    isLockPeriod: false,
    lockPeriod: "",
    stakingOpensIn: "",
    isWithdrawOpen: false,
    isEarlyWithdraw: false,
  };

  if (minutes < 60) {
    toReturn.stakingClosesIn =
      minutes > 1
        ? Math.round(minutes) + " MINUTES"
        : Math.round(minutes) + " MINUTE(S)";
  } else if (hours < 24) {
    toReturn.stakingClosesIn =
      hours > 1 ? Math.round(hours) + " HOURS" : Math.round(hours) + " HOUR";
  } else if (days < 30) {
    toReturn.stakingClosesIn =
      days > 1 ? Math.round(days) + " DAYS" : Math.round(days) + " DAY";
  } else {
    toReturn.stakingClosesIn =
      months > 1
        ? Math.round(months) + " MONTHS"
        : Math.round(minutes) + " MONTH";
  }

  const stakeStart = moment(ssd, "YYYY-MM-DD HH:mm:ss.SSSS");
  const stakeEnd = moment(sed, "YYYY-MM-DD HH:mm:ss.SSSS");

  const withdrawStart = moment(wsd, "YYYY-MM-DD HH:mm:ss.SSSS");

  const withdrawEnd = moment(wed, "YYYY-MM-DD HH:mm:ss.SSSS");
  const now = moment(new Date(), "YYYY-MM-DD HH:mm:ss.SSSS");

  //   console.log(now.isAfter(stakeStart) && now.isBefore(stakeEnd));

  if (now.isAfter(stakeStart) && now.isBefore(stakeEnd)) {
    toReturn.isStakingOpen = true;
  }

  if (now.isBefore(stakeStart)) {
    const months2 = moment.duration(stakeStart.diff(now)).asMonths();
    const days2 = moment.duration(stakeStart.diff(now)).asDays();
    const hours2 = moment.duration(stakeStart.diff(now)).asHours();
    const minutes2 = moment.duration(stakeStart.diff(now)).asMinutes();

    // console.log(months2, days2, hours2, minutes2);
    if (minutes2 < 60) {
      toReturn.stakingOpensIn =
        hours2 > 1
          ? Math.round(minutes2) + " MINUTES"
          : Math.round(minutes2) + " MINUTE(S)";
    } else if (hours2 < 24) {
      toReturn.stakingOpensIn =
        hours2 > 1
          ? Math.round(hours2) + " HOURS"
          : Math.round(hours2) + " HOUR";
    } else if (days2 < 30) {
      toReturn.stakingOpensIn =
        days2 > 1 ? Math.round(days2) + " DAYS" : Math.round(days2) + " DAY";
    } else {
      toReturn.stakingOpensIn =
        months2 > 1
          ? Math.round(months2) + " MONTHS"
          : Math.round(months2) + " MONTH";
    }
  }

  if (now.isAfter(stakeEnd) && now.isBefore(withdrawStart)) {
    toReturn.isLockPeriod = true;

    const months1 = moment.duration(withdrawStart.diff(now)).asMonths();
    const days1 = moment.duration(withdrawStart.diff(now)).asDays();
    const hours1 = moment.duration(withdrawStart.diff(now)).asHours();
    const minutes1 = moment.duration(withdrawStart.diff(now)).asMinutes();

    if (minutes < 60) {
      toReturn.lockPeriod =
        minutes1 > 1
          ? Math.round(minutes1) + " MINUTES"
          : Math.round(minutes1) + " MINUTE(S)";
    } else if (hours < 24) {
      toReturn.lockPeriod =
        hours1 > 1
          ? Math.round(hours1) + " HOURS"
          : Math.round(hours1) + " HOUR";
    } else if (days < 30) {
      toReturn.lockPeriod =
        days1 > 1 ? Math.round(days1) + " DAYS" : Math.round(days1) + " DAY";
    } else {
      toReturn.lockPeriod =
        months1 > 1
          ? Math.round(months1) + " MONTHS"
          : Math.round(minutes1) + " MONTH";
    }
  }

  if (now.isAfter(withdrawEnd)) {
    toReturn.isWithdrawOpen = true;
  }

  if (now.isAfter(withdrawStart) && now.isBefore(withdrawEnd)) {
    toReturn.isEarlyWithdraw = true;
  }

  return toReturn;
};
