# Anglo Saxon Calemndar Date & Ad Numerare Dierum Date
## Saxon date
According to the Venerable Bede, the pre-Christian Angles, Saxons, Jutes and Frisians used a soli-lunar calendar. In his book, De Temporum Ratione, published in the 725, Bede lays out the rules by which this calendar worked, and the names of the months among the English peoples. I became curious how this calendar worked. So, using Bede's rules, I coded this Lunar calendar in Javascript. Because I could. Thanks, Bede.

Rule 1
Each month begins at the new moon. There are 12 months in a regular year, and 13 in an intercalary year.

Rule 2
The year begins with the new moon following the winter solstice.

Rule 3
Although the beginning of the year is linked to the winter solstice, the rule on intercalary months is governed by the summer solstice: If, within a fortnight following the summer solstice, a new moon occurs, the next new moon (i.e., the one that will happen approximately 29 days later) is an intercalary month (Trilitha), which occurs every three to five years, making it a 13 month year, which keeps the seasons aligned. This was especially important for an agricultural society.

For the purpose of saxon-date, I am using the Runic Era (RE) year. The RE is not a real thing. It basically just adds 250 years to the current Gregorian year. I wanted to use a year/era that was older than the current era to show that this traditional indigenous calendar, and the culture it is attached to, pre-dates the Christianization of Europe. However, since the Germanic peoples of northwest Europe were largely illiterate at that time, there does not seem to a historical era that fits the bill.

## Ad Numerare Dierum
As you may have realized, I am interested in measuring time. For example, my Saxon Date project looks to recreate the lunar calendar of our ancient ancestors. Well... my ancient ancestors, anyway.

That calendar measures time in a way that is intimately tied to the tides and seasons, to solstice and moon phase. It was how our people, and, in fact, people everywhere told time before watches, clocks and computers. But, also wanted to explore the opposite. A way of measuring time that is completely disconnected from the natural world. A way of telling time that would be the same, anywhere... everywhere... unlike the current Gregorian calendar, one that is a universal method, independent of the sun or the relative position of the earth in relation to its orbit.

To that end, I have fitted together the Julian Date and Swatch Internet Beats in a way that measures time logically and consistently. And in a way that is completely devoid of where the earth is in its orbit or on its axis at any given moment.
